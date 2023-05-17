import React, {Component} from "react";
import {Button, Container, Row, Col, Table, Pagination} from "react-bootstrap";
import trash from '../../../assets/icons/trash.svg'
import pen from '../../../assets/icons/pen.svg'
import ShinaApi from '../../../js/api/api'
import KeyModal from "../../../components/modals/keyModal/keyModal";

export default class DataTable extends Component {
    state = {
        list: [],
        count: 0,
        filter: {
            page: 1,
            per_page: 10
        },
        last_page: 1,
        showKeyModal: false,
        editKey: ''
    }

    getSettings = () => {
        ShinaApi.getSettings(this.state.filter).then(res => {
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
            this.getSettings()
        })
    }
    handleModalShowHide = () => {
        this.setState({showKeyModal: !this.state.showKeyModal, editKey: ''})
        this.getSettings()
    }

    deleteKeySetting = (id) => {
        ShinaApi.deleteSettings(id).then(async () => {
            await this.getSettings()
        })

    }
    editSettingKey = (key) => {
        this.handleModalShowHide()
        this.setState({editKey: key})
    }

    componentDidMount() {
        this.getSettings()
    }

    render() {
        const {list, count, filter: {page, per_page}} = this.state,
            stable = ['dev_front_link', 'prod_front_link'],
            items = list.map(e => {
                const {key, value} = e
                return (
                    <tr key={'_key' + key}>
                        <td>{key}</td>
                        <td>{value}</td>
                        <td>
                            {!stable.includes(key) ? (<div>
                                <a href="/#" className="mr-3" onClick={() => this.editSettingKey(key)}><img src={pen} alt=""/></a>
                                <a href="/#" className={'d-inline-block'} onClick={() => this.deleteKeySetting(key)}><img
                                    src={trash}
                                    alt=""/></a>
                            </div>) : ''}
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
                        <Col lg={3} xl={3} md={4}><h2>Ключи</h2></Col>
                        <Col lg={3} xl={3} md={4} className={'text-right'}>
                            <Button className={'btn-custom'} onClick={this.handleModalShowHide}>Создать ключ</Button>
                        </Col>
                    </Row>
                    <Row className={'custom-table'}>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Ключ</th>
                                    <th>Значение</th>
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
                <KeyModal show={this.state.showKeyModal}
                          onHide={this.handleModalShowHide}
                          editKey={this.state.editKey}
                          getAllList={this.getSettings}
                />
            </Container>

        )


    }

}
