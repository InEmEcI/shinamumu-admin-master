import React, {Component} from "react";
import {Button, Container, Row, Col, Table, Pagination} from "react-bootstrap";
import trash from '../../../assets/icons/trash.svg'
import pen from '../../../assets/icons/pen.svg'
import ShinaApi from '../../../js/api/api'
import UserModal from "../../../components/modals/userModal/userModal";

export default class DataTable extends Component {
    state = {
        users: [],
        count: 0,
        filter: {
            page: 1,
            per_page: 10
        },
        last_page: 1,
        filter_settings: {
            key__in: 'dev_front_link,prod_front_link'
        },
        settings: [],
        showUserModal: false,
        editUserId: '',
    }

    getUserList = () => {
        return new Promise(resolve => {
            ShinaApi.getUsers(this.state.filter).then(res => {
                const {count, results} = res.data
                this.setState({users: results, count: count})
                resolve()
            })
        })
        // ShinaApi.getSubsidiaries()
    }

    getSettings = () => {
        return new Promise(resolve => {
            ShinaApi.getSettings(this.state.filter_settings).then(res => {
                this.setState({settings: res.data.results})
                resolve()
            })
        })
    }
    handleModalShowHide = () => {
        this.setState({ showUserModal: !this.state.showUserModal })
        this.setState({editUserId: '' })
    }
    changePage = (page) => {
        this.setState(prevState => ({
            filter: {
                ...prevState.filter,
                page: page
            }
        }), async () => {
            await this.getUserList()
        })
    }
    editUser = (user_id) => {
        this.handleModalShowHide()
        this.setState({editUserId: user_id })
    }
    deleteUser = (user_id) => {
        ShinaApi.deleteUser(user_id).then(async () => {
           await this.getUserList()
        })

    }
    async componentDidMount() {
        await this.getSettings()
        await this.getUserList()
    }

    render() {
        const {users, count, filter: {page, per_page}, settings} = this.state,
            linker = () => {
                const proc = process.env.NODE_ENV,
                    link = proc === 'development' ? 'dev_front_link' : 'prod_front_link',
                    find = settings.find(e => e.key === link)
                return find ? find.value : ''
            },
            items = users.map(e => {
                const {id, first_name, last_name, subsidiaries} = e,
                    companies = subsidiaries.map((e, key) => <a key={key + e.id + 'sub'}
                                                                className="alert-primary"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                href={linker()+'organisation/' + e.slug}>{e.name}</a>)
                return (
                    <tr key={'user' + id}>
                        <td>{id}</td>
                        <td>{first_name} {last_name}</td>
                        <td>
                            {companies}
                        </td>
                        <td>
                            <a href="/#" className="mr-3" onClick={() => this.editUser(id)}><img src={pen} alt=""/></a>
                            <a href="/#" onClick={() => this.deleteUser(id)}><img src={trash} alt=""/></a>
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
                <Container fluid>
                    <div className={'infoPanel'}>
                        <h2>Пользователей на сайте: <span className="ccount">{count}</span></h2>
                    </div>
                </Container>
                <div className={'infoPanel dataTable'}>
                    <Row className={'justify-content-between align-items-center'}>
                        <Col lg={3} xl={3} md={4}><h2>Пользователи</h2></Col>
                        <Col lg={3} xl={3} md={4} className={'text-right'}>
                            <Button className={'btn-custom'}
                                    onClick={this.handleModalShowHide}>
                                Создать пользователя
                            </Button>
                        </Col>
                    </Row>
                    <Row className={'custom-table'}>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Id пользователя</th>
                                    <th>ФИО</th>
                                    <th>Ссылка на страницу шиномонтажа</th>
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
                <UserModal show={this.state.showUserModal}
                           onHide={this.handleModalShowHide}
                           getAllList={this.getUserList}
                           editUser={this.state.editUserId}
                />
            </Container>

        )


    }

}
