import React from "react";
import {Button, Modal, Form} from "react-bootstrap";
// import './userModal.scss'

export default class UserModal extends React.Component {

    onHideModal = () => {
        this.props.onHide()
    }

    createSubsidiary = () => {
        this.props.onApprove()
    }

    render() {
        const {action} = this.props
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton onHide={this.onHideModal}>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="forming">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Подтвердите действие {action && <span>"{action}"</span>}</Form.Label>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={this.createSubsidiary}>Ок</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
