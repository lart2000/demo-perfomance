import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

// import global from '../providers/global.static.jsx';

import Home from './components/modules/home/home'

import ListThesesHome from './components/modules/home/theses/list';

import ListThesesIntranet from './components/modules/intranet/theses/list';
import FormThesesIntranet from './components/modules/intranet/theses/form';
import Authors from './components/modules/intranet/authors/index'
import Juries from './components/modules/intranet/juries/index'
import Advisers from './components/modules/intranet/advisers/index'

import User from './components/modules/intranet/user/configure';
import ErrorPage from './components/modules/intranet/error_page/error_page';

const AppRoutes = () => {
    let nameCookie = "_sdat=";
    let cookies = document.cookie.split(";").filter((el) => { return el.trim().indexOf(nameCookie) === 0 });
    if (cookies.length === 0) {
        return (
            <Switch>
                <Route exact path="/" component={ListThesesHome} />
                <Route exact path="/iniciar_sesion" component={Home} />
                <Route component={ErrorPage} />
            </Switch>
            )
        }else{
            return (
                <Switch>
                    <Route exact path="/tesis" component={ListThesesIntranet} />
                    <Route exact path="/nuevo" component={FormThesesIntranet} />
                    <Route exact path="/tesis/:id" component={FormThesesIntranet} />
                    <Route exact path="/configuracion" component={User} />
                    <Route exact path="/autor/lista" component={Authors} />
                    <Route exact path="/jurado/lista" component={Juries} />
                    <Route exact path="/asesor/lista" component={Advisers} />
                    <Route component={ErrorPage} />
                </Switch>
            )
    }
}

export default AppRoutes;
