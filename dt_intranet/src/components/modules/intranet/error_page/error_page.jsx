import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Cookie from '../../../utils/cookie';

class errorPage extends Component {
    render() {
        if (Cookie.readCookie("user_name"))  return <Redirect to={"/tesis"}/>;
        return (
            <Redirect to={"/"}/>
        );
    }
}

export default errorPage;