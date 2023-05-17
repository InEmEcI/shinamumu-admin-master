import React, {Component} from "react";
import {Form, Button} from "react-bootstrap";
import ShinaApi from '../../js/api/api'
import {connect} from 'react-redux';


class Login extends Component {
    state = {
        phone: '86666666666',
        password: 'password'
    }

    login = () => {
        ShinaApi.login(this.state).then(async res => {
           await this.props.setToken(res.data.access)
        })
    }

    render() {
        const {phone, password} = this.state
        return (
            <section className="login-form">
                <Form className="forming">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Введите телефон</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone" value={phone} onChange={(e) => {
                            this.setState({phone: e.target.value})
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {
                            this.setState({password: e.target.value})
                        }}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out"/>
                    </Form.Group>
                    <Button onClick={this.login} variant="primary" type="button">
                        Login
                    </Button>
                </Form>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setToken: (data) => dispatch({type: 'SET_TOKEN', payload: data})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
