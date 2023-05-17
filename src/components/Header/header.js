import React, {Component} from "react";
import {Container, Row, Col, DropdownButton, Dropdown} from "react-bootstrap";
import {connect} from "react-redux";

class Header extends Component {
    redirect = (path = '/') => {
        const {history} = this.props
        history.push(path)
    }

    logoutHandler = async () => {
        await this.props.logout()
    }

    render() {
        return (
            <header>
                <Container fluid>
                    <Row className={'justify-content-between'}>
                        <Col xl={3} lg={3} md={4} className={'d-flex align-items-center'}>
                            <a href="/">ЯМастерШин.рф</a>
                        </Col>
                        <Col xl={3} lg={3} md={4} className={'user-header'}>
                            <div className={'user-photo'}>
                                A
                            </div>
                            <DropdownButton id="dropdown-item-button" title="Администратор">
                                <Dropdown.ItemText className="cursor-pointer" onClick={() => this.redirect()}>Пользователи</Dropdown.ItemText>
                                <Dropdown.ItemText className="cursor-pointer" onClick={() => this.redirect('/subsidiaries')}>Организации</Dropdown.ItemText>
                                <Dropdown.ItemText className="cursor-pointer" onClick={() => {
                                    this.redirect('/settings')
                                }}>Настройки</Dropdown.ItemText>
                                <Dropdown.ItemText className="cursor-pointer" onClick={this.logoutHandler}>Выйти</Dropdown.ItemText>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Container>
            </header>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch({type: 'REMOVE_TOKEN'})
    }
}

export default connect(null, mapDispatchToProps)(Header)
