import './App.scss';
import Login from "./views/Login/login";
import Dashboard from './views/Dashboard/dashboard'
import Settings from './views/settings/settings'
import Subsidiaries from './views/subsidiaries/subsidiariesList'
import SubsidiaryForm from "./views/subsidiaries/singleModel/subsidiaryForm";
import {
    Switch,
    Route,
    Redirect,
    withRouter
} from "react-router-dom";
import React, {Component} from "react";
import {connect} from "react-redux";
import ShinaApi from './js/api/api'
import Header from "./components/Header/header";


class App extends Component {
    componentDidMount() {
        const {token} = this.props
        if (token) {
            this.getUserData()
        }
    }

    getUserData = () => {
        ShinaApi.getUserInfo().then(res => {
            this.props.setUserData(res.data)
        })
    }

    render() {

        const {token, history} = this.props
        return (
            <div className="App">
                {token && <Header history={history}/>}
                <main>
                    <Switch>
                        <Route history={history} exact path="/"
                               render={() => token ? (<Dashboard/>) : (<Redirect to="/login"/>)}>
                        </Route>
                        <Route history={history} exact path="/settings"
                               render={() => token ? (<Settings/>) : (<Redirect to="/login"/>)}>
                        </Route>
                        <Route history={history} exact path="/subsidiaries"
                               render={() => token ? (<Subsidiaries history={history}/>) : (<Redirect to="/login"/>)}>
                        </Route>
                        <Route history={history} exact path="/login"
                               render={() => !token ? (<Login/>) : (<Redirect to="/"/>)}>
                        </Route>
                        <Route path="/form-subsidiary/:id?"
                               render={({match, history}) => token ? (<SubsidiaryForm id={match.params.id} history={history}/>) : (<Redirect to="/"/>)}>
                        </Route>
                    </Switch>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserData: data => dispatch({type: 'UPDATE_USER', payload: data})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
