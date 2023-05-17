import React from "react";
import {Button, Modal, Form} from "react-bootstrap";
import ShinaApi from '../../../js/api/api'

export default class KeyModal extends React.Component {
    state = {
        key: '',
        value: '',
    }
    createKey = () => {
        let key = this.props.editKey;
        if(key) {
            ShinaApi.putSingleSetting(key, this.state).then(async () => {
                await this.onHideModal()
            })
        } else {
            ShinaApi.setSettings(this.state).then(async () => {
                await this.onHideModal()
            })
        }
        this.props.getAllList()

    }
    onHideModal = () => {
        this.setState({key:'', value: ''})
        this.props.onHide()
    }
    getSingleModel = (key) => {
        ShinaApi.getSingleSetting(key).then(async (res) => {
            let {key, value} = res.data
           this.setState({key: key, value: value})
        })
    }
    mountedModal = () => {
        let key = this.props.editKey;
        if (key) {
            this.getSingleModel(key)
        }
    }
    render() {
        const {key, value} = this.state
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                onShow={this.mountedModal}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton  onHide={this.onHideModal}>
                    <Modal.Title>Добавить ключ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="forming">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Ключ</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Введите ключ" value={key}
                                          onChange={(e) => {
                                this.setState({key: e.target.value})
                            }}
                            readOnly={!!this.props.editKey}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Значение</Form.Label>
                            <Form.Control type="text" placeholder="Введите значение" value={value} onChange={(e) => {
                                this.setState({value: e.target.value})
                            }}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={this.createKey}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
