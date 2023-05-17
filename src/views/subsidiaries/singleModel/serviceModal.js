import React, {Component} from "react";
import ShinaApi from '../../../js/api/api'
import {Button, Form, Modal} from "react-bootstrap";

export default class serviceModal extends Component {
    state = {
        model: {
            priority: 1,
            name: '',
            description: '',
            price: '',
            subsidiary: '',
        }
    }

    saveOrChangeModel = () => {
        const {id, onHide} = this.props,
            {model} = this.state
        if (id) {
            ShinaApi.patchServiceById(id, model).then(() => onHide())
        } else {
            ShinaApi.createService(model).then(() => onHide())
        }
    }
    onHideModal = () => {
        this.props.onHide()
    }
    getSingleModel = () => {
        const {id, subsidiary} = this.props
        if (id) {
            ShinaApi.getServiceById(id).then((res) => {
                this.setState({model: res.data})
            })
        } else {
            this.setState(prevState => ({
                model: {
                    ...prevState.model,
                    subsidiary: subsidiary
                }
            }))
        }
    }

    handleStateInput = (evt) => {
        const {name, value} = evt.target
        this.setState(prevState => ({
            model: {
                ...prevState.model,
                [name]: value
            }
        }))
    }

    render() {
        const {model: {name, price, description, priority, id}} = this.state

        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                onShow={this.getSingleModel}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton onHide={this.onHideModal}>
                    <Modal.Title>{id ? 'Редактировать' : 'Добавить'} услугу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="forming">
                        <Form.Group>
                            <Form.Label>Наименование</Form.Label>
                            <Form.Control type="text"
                                          name="name"
                                          value={name}
                                          placeholder="Введите имя"
                                          onChange={this.handleStateInput}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Краткое описание</Form.Label>
                            <Form.Control type="text"
                                          name="description"
                                          as="textarea"
                                          value={description}
                                          placeholder="Краткое описание"
                                          row={5}
                                          onChange={this.handleStateInput}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Стоимость, руб</Form.Label>
                            <Form.Control type="number"
                                          name="price"
                                          value={price}
                                          placeholder="Стоимость, руб"
                                          onChange={this.handleStateInput}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Приоритет</Form.Label>
                            <Form.Control type="number"
                                          name="priority"
                                          value={priority}
                                          placeholder="Приоритет"
                                          onChange={this.handleStateInput}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button disabled={!name || !price || !description || !priority} variant="primary"
                            onClick={this.saveOrChangeModel}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
