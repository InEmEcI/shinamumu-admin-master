import React from "react";
import {Button, Modal, Form} from "react-bootstrap";
import ShinaApi from '../../../js/api/api'
// import './userModal.scss'

export default class UserModal extends React.Component {
    state = {
        name: ''
    }

    onHideModal = () => {
        this.setState({
            name: ''
        })
        this.props.onHide()

    }

    createSubsidiary = () => {
        ShinaApi.createSubsidiary({
            name: this.state.name
        }).then((res) => {
            this.props.openTheNewSub(res.data.id)
        })
    }

    handleKeyPress = (e) => {
        const {name} = this.state
        if (e?.key === 'Enter' && name) {
            this.createSubsidiary()
        }
        e.stopPropagation()
    }

    render() {
        const {
            name
        } = this.state;
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton onHide={this.onHideModal}>
                    <Modal.Title>Введите название новой организации</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="forming">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text"
                                          onKeyPress={this.handleKeyPress}
                                          placeholder="Введите название" value={name}
                                          onChange={(e) => {
                                              this.setState({name: e.target.value})
                                          }}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button disabled={!name} variant="primary" onClick={this.createSubsidiary}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
