import React, { Component } from 'react';

import Header from '../../../components/render/home/header';
import Footer from '../../../components/render/home/footer';
import Form from '../../../components/render/home/form';
import global from '../../../../providers/global.static.jsx';

import '../../../sass/modules/home/index.sass';


class Home extends Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div className="home">
                <Header src_logo={global.URLBASEVIEW+"/src/images/logo_unjfsc.png"}/>
                <Form/>
                <Footer/>

            </div>
        )
    }


}

export default Home;
