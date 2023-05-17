import React, {Component} from "react";
import ShinaApi from '../../../js/api/api'
import {Button, Table, Form, Spinner, Nav, FormControl, Dropdown} from "react-bootstrap";
import {generate_timelist, uniqueByKey} from "../../../js/functions";
import trash from '../../../assets/icons/trash.svg'
import pen from '../../../assets/icons/pen.svg'
import map from '../../../assets/icons/pin.svg'
import ServiceModal from './serviceModal'
import YandexModal from './yandexModal'
import {AddressSuggestions} from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';


export default class SubsidiaryForm extends Component {
    constructor() {
        super();
        this.state = {
            model: {
                name: '',
                phone: '',
                email: '',
                address: '',
                photos: [],
                work_schedules: [],
                services: [],
                season: '',
                contact: '',
                publish: false,
                wallpaper: null
            },
            loaded: false,
            preWallpapper: '',
            photoSeason: 'winter',
            dayLoading: false,
            timelist: generate_timelist(1, {disabled: false}, true),
            timelist_finish: generate_timelist(1, {disabled: false}, true, true),
            seasons: [
                {
                    title: 'Лето',
                    value: 'summer'
                },
                {
                    title: 'Зима',
                    value: 'winter'
                },
                {
                    title: 'Выберите сезон',
                    value: null
                },
            ],
            showServiceModal: false,
            editIdService: 0,
            showYandexModal: false,
            owners: [],
            owner_search: '',
            full_day: false,
            every_day: false
        }
        this.inpRef = React.createRef()
        this.seasonRef = React.createRef()
        this.publishRef = React.createRef()
        this.addressref = React.createRef()
    }

    async componentDidMount() {
        await this.getSubsidiary()
        await this.getOwnersList()
        const {model: {user_id, address}} = this.state
        if (user_id) {
            await this.getCurrentOwner(user_id)
        }
        this.setState({loaded: true})
        this.addressref.current.setInputValue(address)
    }

    getCurrentOwner = async (id) => {
        await ShinaApi.getUser(id).then(res => {
            this.setState(prevState => ({
                owners: uniqueByKey([res.data, ...prevState.owners], 'id')
            }))
        })
    }
    setAddress = (val) => {
        console.log(val, 'val')
        const {value, data: {city, geo_lat, geo_lon, region_with_type}} = val
        this.setState(prevState => ({
            model: {
                ...prevState.model,
                coordinates: {
                    coordinates: [Number(geo_lat), Number(geo_lon)],
                    type: "Point"
                },
                city_name: city || region_with_type,
                address: value
            },
        }))
        console.log(val)
    }

    getOwnersList = async () => {
        const {owner_search} = this.state,
            object = {
                page: 1,
                per_page: 10,
                search: owner_search
            }
        await ShinaApi.getUsers(object).then(res => {
            this.setState({owners: res.data.results})
        })
    }

    getSubsidiary = async (full_replace = true, field = 'photos') => {
        if (this.props.id) {
            await ShinaApi.getSubsidiary(this.props.id).then(res => {
                if (full_replace) {
                    const {data, data: {work_schedules}} = res
                    if (work_schedules && work_schedules.length) {
                        if (work_schedules.length === 7) {
                            this.setState({every_day: true})
                        }
                        const is_full_day = work_schedules.every(item => item.finish === '23:59:59' && item.start === '00:00:00')
                        this.setState({full_day: is_full_day})
                    }
                    this.setState({model: data})
                } else {
                    const data = res.data[field]
                    this.setState(prevState => ({
                        model: {
                            ...prevState.model,
                            [field]: data
                        }
                    }))
                }
            })
        }
    }

    handleStateInput = (evt) => {
        const {target, target: {name, type}} = evt,
            value = type === 'checkbox' ? target.checked : target.value;
        this.setState(prevState => ({
            model: {
                ...prevState.model,
                [name]: value
            }
        }))
    }

    refClick = () => {
        this.inpRef.current.click()
    }
    seasonRefClick = () => {
        this.seasonRef.current.click()
    }

    fileUpload = (e) => {
        const formData = new FormData(),
            file = e.target.files[0],
            {id} = this.props
        console.warn(file)
        formData.append('wallpaper', file)
        ShinaApi.patchSubsidiary(id, formData).then((res) => {
            const {wallpaper} = res.data
            this.setState(prevState => ({
                model: {
                    ...prevState.model,
                    wallpaper: wallpaper
                }
            }))
        })
    }

    uploadPhoto = (e) => {
        const files = e.target.files[0],
            fd = new FormData(),
            {photoSeason} = this.state,
            {id} = this.props,
            photo_model = {
                season: photoSeason,
                image: files,
                subsidiary: id
            };
        for (let prop in photo_model) {
            fd.append(prop, photo_model[prop])
        }
        ShinaApi.uploadSubsidiaryPhoto(fd).then(async () => {
            await this.getSubsidiary(false, 'photos')
        })
    }

    removeDayWeek = async (id) => {
        this.setState({dayLoading: true})
        await ShinaApi.deleteSchedule(id).then(async () => {
            await this.getSubsidiary(false, 'work_schedules')
            this.setState({dayLoading: false})
        })
    }

    addNewDay = async () => {
        const {model: {work_schedules}} = this.state,
            {id} = this.props
        const current_slug_days = work_schedules.map(e => e.week_day),
            classic_week_in = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            difference = classic_week_in.filter(e => !current_slug_days.includes(e))
        let res = difference && difference.length ? difference[0] : null
        if (res) {
            const object = {
                "week_day": res,
                "start": '00:00:00',
                "finish": '23:59:59',
                "subsidiary": id,
                "rus_week_day": res
            }
            this.setState({dayLoading: true})
            await ShinaApi.createSchedules(object).then(async () => {
                await this.getSubsidiary(false, 'work_schedules')
                this.setState({dayLoading: false, every_day: this.state.model.work_schedules.length === 7})
            })
        }
    }

    changeSchedule = async (id, value = null, field = null, item) => {
        if (value && field) {
            item[field] = value
        }
        await ShinaApi.patchSchedules(id, item).then(async () => {
            await this.getSubsidiary(false, 'work_schedules')
        })
    }

    handleModalShowHide = () => {
        const {showServiceModal} = this.state
        this.setState({showServiceModal: !showServiceModal, editIdService: 0}, async () => {
            await this.getSubsidiary(false, 'services')
        })
    }

    callServiceModal = (id) => {
        this.setState({
            editIdService: id,
            showServiceModal: true
        })
    }

    createOrUpdateSubsidiary = () => {
        const {model} = this.state,
            form_data = new FormData(),
            {id} = this.props
        delete model.wallpaper

        for (let prop in model) {
            const cur = model[prop]
            if (cur) {
                if (!Array.isArray(cur)) {
                    if (prop !== 'coordinates') {
                        form_data.append(prop, cur)
                    } else {
                        form_data.append(prop, JSON.stringify(cur))
                    }
                }
            }
        }

        ShinaApi.patchSubsidiary(id, form_data).then(() => {
            this.props.history.push('/subsidiaries')
        })
    }

    hideMapModal = () => {
        this.setState({showYandexModal: false})
    }

    saveResult = (model) => {
        const {coordinates, address, city_name} = model,
            _model_coords = {
                coordinates: coordinates,
                type: 'Point'
            }
        this.setState(prevState => ({
            model: {
                ...prevState.model,
                coordinates: _model_coords,
                city_name: city_name,
                address: address
            },
            showYandexModal: false
        }))
        this.addressref.current.setInputValue(address)
    }


    dropDownForOwner = e => {
        this.setState(prevState => ({
            model: {
                ...prevState.model,
                user_id: Number(e)
            }
        }))
    }

    fullDayChange = (e) => {
        return new Promise(async resolve => {
            const {checked} = e.target
            this.setState({full_day: checked})
            // changeSchedule = (id, value = null, field = null, item) => {
            if (checked) {
                const {model: {work_schedules}} = this.state
                for (let item of work_schedules) {
                    item.start = '00:00:00'
                    item.finish = '23:59:59'
                    await this.changeSchedule(item.id, null, null, item)
                    console.log(item.id)
                }
            }
            resolve()
        })
    }

    everyDayChange = async (e) => {
        const {model: {work_schedules}} = this.state,
            len = work_schedules.length
        const {checked} = e.target
        this.setState({every_day: checked})
        if (checked && len < 7) {
            const needle = 7 - len,
                array_emit = Array(needle).fill(1)
            console.warn(array_emit)
            for (let item of array_emit) {
                item = item + 1 // linter gonna fuck without it
                await this.addNewDay()
            }
        }
    }

    addressBlur = () => {
        const {model: {address, coordinates}} = this.state
        console.warn('blur', address, coordinates)
    }

    render() {
        const {
                model: {
                    name,
                    phone,
                    email,
                    address,
                    contact,
                    wallpaper,
                    about,
                    photos,
                    work_schedules,
                    services,
                    season,
                    publish,
                    coordinates,
                    user_id
                },
                loaded,
                photoSeason,
                timelist,
                timelist_finish,
                dayLoading,
                showServiceModal,
                editIdService,
                seasons,
                showYandexModal,
                owners,
                owner_search,
                full_day,
                every_day
            } = this.state,
            photo_list = photos.filter(e => e.season === photoSeason).map(e => {
                const {id, image, season} = e
                return (
                    <div className="photo-item" key={id + 'img' + season}>
                        <img src={image} alt=""/>
                    </div>
                )
            }),
            time_options = timelist.map((e, index) => {
                const {value, disabled, text} = e
                return (
                    <option value={value} disabled={disabled} key={index + 'sche_opt'}>{text}</option>
                )
            }),
            time_options_end = timelist_finish.map((e, index) => {
                const {value, disabled, text} = e
                return (
                    <option value={value} disabled={disabled} key={index + 'sche_opt-after'}>{text}</option>
                )
            }),
            owners_view = owners.map((e, index) => {
                const {id, first_name, last_name, phone} = e
                return (
                    <Dropdown.Item key={'owner_id' + id}
                                   active={user_id === id}
                                   eventKey={id}>{first_name} {last_name}, {phone}</Dropdown.Item>
                )
            }),
            season_options = seasons.map((e, index) => {
                const {title, value} = e;
                return (
                    <option key={index + 'season_oppt'} value={value}>{title}</option>
                )
            }),
            schedules = work_schedules.map(e => {
                const {id, finish, start, week_day, rus_week_day} = e;
                return (
                    <div key={'sche' + id + week_day} className="d-flex align-items-center">
                        <b className="mr-3 day-week">{rus_week_day}</b>
                        <div className="d-flex">
                            <Form.Group className="mr-3 stable-width">
                                <Form.Label>C</Form.Label>
                                <Form.Control value={start || ''} as="select" size="sm" custom
                                              onChange={(item) => this.changeSchedule(id, item.target.value, 'start', e)}
                                >
                                    {time_options}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="stable-width">
                                <Form.Label>До</Form.Label>
                                <Form.Control value={finish || ''} as="select" size="sm" custom
                                              onChange={(item) => this.changeSchedule(id, item.target.value, 'finish', e)}
                                >
                                    {time_options_end}
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <p onClick={() => this.removeDayWeek(id)} className="removeCross">&#x2715;</p>
                    </div>
                )
            }),
            service_list = services.map(e => {
                const {id, name, price, description} = e;
                return (
                    <tr key={id + 'service'}>
                        <td>{name}</td>
                        <td>{description}</td>
                        <td>{price}</td>
                        <td>
                            <div className="control-tbl">
                                <p onClick={() => this.callServiceModal(id)} className="cursor-pointer"><img src={pen}
                                                                                                             alt=""/>
                                </p>
                                <p className="cursor-pointer"><img src={trash} alt=""/></p>
                            </div>
                        </td>
                    </tr>
                )
            })
        // Dropdown needs access to the DOM of the Menu to measure it
        const CustomMenu = React.forwardRef(
            ({children, style, className, 'aria-labelledby': labeledBy}, ref) => {
                return (
                    <div
                        ref={ref}
                        style={style}
                        className={className}
                        aria-labelledby={labeledBy}
                    >
                        <FormControl
                            autoFocus
                            className="mx-3 my-2 w-auto"
                            placeholder="Type to filter..."
                            onInput={(e) => {
                                this.setState({owner_search: e.target.value}, async () => {
                                    await this.getOwnersList()
                                })
                            }}
                            value={owner_search}
                        />
                        <ul className="list-unstyled">
                            {React.Children.toArray(children)}
                        </ul>
                    </div>
                );
            }
        )
        const current_owner = !user_id ? 'Выберите владельца' : (() => {
            const find = owners.find(item => item.id === user_id)
            const {first_name = '', last_name = '', phone = ''} = find || {}
            return `${first_name} ${last_name} ${phone}`
        })()

        return (
            (loaded ? (<div className="container-fluid infoPanel">
                    <div className="d-flex justify-content-between">
                        <h2>Организация: {name}</h2>
                        <Button disabled={!name} onClick={this.createOrUpdateSubsidiary}>Сохранить</Button>
                    </div>
                    <div className="d-flex">
                        <Form.Group onClick={() => this.publishRef.current.click()} className="mr-3">
                            <Form.Label>Опубликовано</Form.Label>
                            <Form.Switch ref={this.publishRef} name="publish" defaultChecked={publish} size="sm"
                                         onChange={this.handleStateInput}
                            >
                            </Form.Switch>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Текущий сезон</Form.Label>
                            <Form.Control name="season" defaultValue={season} as="select" size="sm" custom
                                          onChange={this.handleStateInput}
                            >
                                {season_options}
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="row-block">
                        <Form.Group>
                            <Form.Label>Наименование</Form.Label>
                            <Form.Control name="name" value={name || ''} type="text" placeholder="Введите наименование"
                                          onChange={this.handleStateInput}/>
                            {/*<Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>*/}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Номер телефона организации</Form.Label>
                            <Form.Control name="phone" value={phone || ''} type="text"
                                          onChange={this.handleStateInput}
                                          placeholder="Телефон в международном формате"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Эл.почта организации</Form.Label>
                            <Form.Control name="email" value={email || ''} type="text" placeholder="Эл.почта организации"
                                          onChange={this.handleStateInput}/>
                        </Form.Group>
                        <Form.Group className={'position-relative dadata-inp'}>
                            <Form.Label>Адрес <span style={{color: "red"}}>(*из списка или на карте)</span></Form.Label>
                            <AddressSuggestions
                                token="4f1a83e5899bb06264f50c5c84d007bf9a59f6d6"
                                ref={this.addressref}
                                value={address || ''}
                                placeholder="Адрес организации"
                                inputProps={{
                                    onBlur: this.addressBlur
                                }}
                                onChange={this.setAddress}/>
                            <img src={map}
                                 className={'cursor-pointer map-icon'}
                                 alt=""
                                 onClick={() => {
                                     this.setState({
                                         showYandexModal: true
                                     })
                                 }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Контактное лицо</Form.Label>
                            <Form.Control name="contact" value={contact || ''} type="text" placeholder="Контактное лицо"
                                          onChange={this.handleStateInput}/>
                        </Form.Group>
                    </div>

                    <div className="row-block">
                        <Form.Group>
                            <Form.Label>Владелец</Form.Label>
                            <Dropdown onSelect={e => this.dropDownForOwner(e)}>
                                <Dropdown.Toggle id="dropdown-custom-components">
                                    {current_owner}
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    {owners_view}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </div>

                    <div className="row-block">
                        <Form.Group className="area">
                            <Form.Label>О себе</Form.Label>
                            <Form.Control name="about" value={about || ''} as="textarea" rows={10} size="lg"
                                          onChange={this.handleStateInput}
                            />
                        </Form.Group>
                        <div>
                            <p>Обои</p>
                            <input onChange={this.fileUpload} ref={this.inpRef} className="file-inp" type="file"/>
                            <Button onClick={this.refClick} className="d-block mt-1">Обновить</Button>
                            {wallpaper && <img className="mt-1" src={wallpaper} alt="wallpaper"/>}
                        </div>
                    </div>

                    <div className="row-block">
                        <div className="w-50">
                            <h3 className="mt-2">Режим работы</h3>
                            <div className="d-flex justify-content-start">
                                <Form.Group className="mb-3" controlId="formReg">
                                    <Form.Check onChange={this.fullDayChange} checked={full_day} type="checkbox"
                                                label="Круглосуточно"/>
                                </Form.Group>
                                <Form.Group className="ml-2 mb-3" controlId="formReg">
                                    <Form.Check onChange={this.everyDayChange} checked={every_day} type="checkbox"
                                                label="Ежедневно"/>
                                </Form.Group>
                            </div>
                            <div className="mt-2">
                                {schedules}
                            </div>
                            <Button disabled={dayLoading || work_schedules.length === 7} onClick={this.addNewDay}
                                    className="d-block">Добавить</Button>
                        </div>

                        <div className="w-50">
                            <h3 className="mt-2">Как нас найти</h3>
                            <div>
                                <Nav variant="pills"
                                     activeKey={photoSeason}
                                     onSelect={e => this.setState({photoSeason: e})}
                                >
                                    <Nav.Item>
                                        <Nav.Link eventKey="winter">Зима</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="summer">Лето</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <div className="photos">
                                    <input className="d-none" type="file" ref={this.seasonRef} onChange={this.uploadPhoto}/>
                                    {photo_list}
                                    <Button onClick={this.seasonRefClick} className="d-block">+</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <h3>Список услуг</h3>
                        <Button onClick={() => this.callServiceModal(null)}>Добавить новую</Button>
                        <Table className="mt-2" striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th>Наименование услуги</th>
                                <th>Краткое описание</th>
                                <th>Стоимость, руб</th>
                                {/*// eslint-disable-next-line*/}
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {service_list}
                            </tbody>
                        </Table>
                    </div>
                    <ServiceModal
                        show={showServiceModal}
                        onHide={this.handleModalShowHide}
                        id={editIdService}
                        subsidiary={this.props.id}
                    />
                    <YandexModal
                        show={showYandexModal}
                        onHide={this.hideMapModal}
                        address={address}
                        coordinates={coordinates ? coordinates.coordinates : []}
                        saveResult={this.saveResult}
                    />
                </div>)
                : <Spinner animation="border"/>)
        )
    }
}
