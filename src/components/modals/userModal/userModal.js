import React from "react";
import {Button, Modal, Form} from "react-bootstrap";
import ShinaApi from '../../../js/api/api'
import './userModal.scss'
import pen from '../../../assets/icons/pen.svg'

export default class UserModal extends React.Component {
    state = {
        name: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        avatar: null,
        avatar_loc: null,
    }


    createUser = () => {
        let loc_model = this.state
            delete loc_model.avatar_loc
        console.log(loc_model)
        let fd = new FormData();
        for (let prop in loc_model) {
            fd.append(prop, loc_model[prop])
        }
        if (this.props.editUser) {
            ShinaApi.editUser(this.props.editUser, fd).then(async () => {
                this.onHideModal()
            })
        } else {
            ShinaApi.createUser(fd).then(async () => {
                this.onHideModal()
            })
        }
    }
    onHideModal = () => {
        this.setState({
            name: '',
            password: '',
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            avatar: null,
            avatar_loc: null,
        })
        this.props.getAllList()
        this.props.onHide()

    }
    getSingleModel = (user_id) => {
        ShinaApi.getUser(user_id).then(async (res) => {
            let {name, password, email, first_name, last_name, phone, avatar} = res.data
            this.setState({
                name: name,
                password: password,
                email: email,
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                avatar: avatar,
                avatar_loc: avatar,

            })
        })
    }
    mountedModal = () => {
        let user_id = this.props.editUser
        console.log(user_id)
        if(user_id) {
            this.getSingleModel(user_id)
        }
    }
    showPreview = (file) => {
        let reader = new FileReader()

        reader.onload = (e) => {
            this.setState({avatar_loc: e.target.result})
        }
        reader.readAsDataURL(file);
    }
    downloadAvatar = (file) => {
        this.setState({avatar: file})
        this.showPreview(file)
    }

    render() {
        const {
            name,
            password,
            email,
            first_name,
            last_name,
            phone
        } = this.state;



        const title = this.props.editUser ? 'Изменить' : 'Создать'
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                onShow={this.mountedModal}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton onHide={this.onHideModal}>
                    <Modal.Title>{title} пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="forming">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите логин" value={name}
                                          onChange={(e) => {
                                              this.setState({name: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password"
                                          placeholder="Введите пароль" value={password}
                                          onChange={(e) => {
                                              this.setState({password: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Эл.почта</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите email" value={email}
                                          onChange={(e) => {
                                              this.setState({email: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите имя" value={first_name}
                                          onChange={(e) => {
                                              this.setState({first_name: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите фамилию" value={last_name}
                                          onChange={(e) => {
                                              this.setState({last_name: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите телефон" value={phone}
                                          onChange={(e) => {
                                              this.setState({phone: e.target.value})
                                          }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Аватар пользователя</Form.Label>
                            <div className={'user-avatar'}>
                                <img src={this.state.avatar_loc} alt=""/>
                                <div className="avatar-edit">
                                    <Form.Control type="file"
                                                  onChange={(e) => {
                                                      this.downloadAvatar(e.target.files[0])
                                                  }}
                                    />
                                    <img src={pen} alt=""/>
                                </div>

                            </div>

                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={this.createUser}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
