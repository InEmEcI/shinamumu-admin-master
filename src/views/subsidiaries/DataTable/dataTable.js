import React, {Component} from "react";
import {Container, Row, Col, Table, Pagination, Button} from "react-bootstrap";
import trash from '../../../assets/icons/trash.svg'
import pen from '../../../assets/icons/pen.svg'
import ShinaApi from '../../../js/api/api'
import CreateSubsidiaryModal from "../../../components/modals/subsidiaryModal/subsidiaryModal"
import AcceptModal from '../../../components/general/acceptModal'

export default class DataTable extends Component {
    state = {
        list: [],
        count: 0,
        filter: {
            page: 1,
            per_page: 10,
            ordering: '-id'
        },
        last_page: 1,
        showSubModal: false,
        cities: [],
        showDeleteApprove: false,
        delete_id: null,
        delete_action: null
    }

    getCities = () => {
        ShinaApi.getCity({
            nopaginate: 1
        }).then(res => {
            this.setState({cities: res.data})
        })
    }

    getSubsidiaries = () => {
        ShinaApi.getSubsidiaries(this.state.filter).then(res => {
            const {results, count} = res.data
            this.setState({list: results, count: count})
        })
    }
    changePage = (page) => {
        this.setState(prevState => ({
            filter: {
                ...prevState.filter,
                page: page
            }
        }), () => {
            this.getSubsidiaries()
        })
    }

    handleModalShowHide = () => {
        this.setState({showSubModal: !this.state.showSubModal})
    }


    componentDidMount() {
        this.getSubsidiaries()
        this.getCities()
    }

    openNewSub = (id) => {
        this.handleModalShowHide()
        if (id) {
            this.props.history.push('/form-subsidiary/' + id)
        }
    }

    hideAcceptModal = () => {
        this.setState({showDeleteApprove: false})
    }

    approveDeleting = () => {
        const {delete_id} = this.state
        if (delete_id) {
            ShinaApi.deleteSubsidiary(delete_id).then(() => {
                const {filter: {page}} = this.state
                if (page > 1) {
                    this.changePage(1)
                } else {
                    this.getSubsidiaries()
                }
                this.hideAcceptModal()
            })
        }
    }

    callDeleteModal = (e, el) => {
        const {id, name} = el
        this.setState({delete_id: id, delete_action: `Удаление организации ${name}`, showDeleteApprove: true})
        e.preventDefault()
    }

    render() {
        const {list, count, filter: {page, per_page}, cities, showSubModal, showDeleteApprove, delete_action} = this.state,
            items = list.map(el => {
                const {name, address, phone, wallpaper, user, id, publish, city} = el,
                    cur_city = city ? cities.find(e => e.id === city) : null
                return (
                    <tr key={'_key' + id}>
                        <td>{name}</td>
                        <td>{address} {phone} <br/> {cur_city && <span>Город/регион: {cur_city.name}</span>}</td>
                        <td>
                            {wallpaper ? <img style={{objectFit: 'cover'}} width={100} height={100} src={wallpaper}
                                              alt="wallpaper"/> :
                                <span>отсутствует</span>}
                        </td>
                        <td>
                            {user?.id &&
                            <a className="alert-primary" href={'/' + user.id}>{user.first_name} {user.last_name}</a>}
                        </td>
                        <td>{publish ? 'да' : 'нет'}</td>
                        <td>
                            <a href={`/form-subsidiary/${id}`} className="mr-3"><img src={pen} alt=""/></a>
                            <a href="#" onClick={(e) => this.callDeleteModal(e, el)}><img src={trash} alt=""/></a>
                        </td>
                    </tr>
                )
            }),
            last_page = Math.ceil(count / per_page),
            pages = Array(last_page).fill(0).map((e, index) => (
                <Pagination.Item onClick={() => this.changePage(index + 1)} key={'page' + index}
                                 active={page === (index + 1)}>{index + 1}</Pagination.Item>))

        return (
            <Container fluid>
                <div className={'infoPanel dataTable'}>
                    <Row className={'justify-content-between align-items-center'}>
                        <Col lg={3} xl={3} md={4}><h2>Организации</h2></Col>
                        <Col lg={3} xl={3} md={4} className={'text-right'}>
                            <Button onClick={() => this.handleModalShowHide()} className={'btn-custom'}>Создать
                                организацию</Button>
                        </Col>
                    </Row>
                    <Row className={'custom-table'}>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Данные и контакты</th>
                                    <th>Изображение</th>
                                    <th>Владелец</th>
                                    <th>Опубликовано</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Pagination size="sm">
                                <Pagination.Prev/>
                                {pages}
                                <Pagination.Next/>
                            </Pagination>
                        </Col>
                    </Row>

                </div>

                <CreateSubsidiaryModal show={showSubModal}
                                       onHide={this.handleModalShowHide}
                                       openTheNewSub={this.openNewSub}
                />
                <AcceptModal show={showDeleteApprove}
                             onHide={this.hideAcceptModal}
                             action={delete_action}
                             onApprove={this.approveDeleting}
                />
            </Container>
        )
    }
}
