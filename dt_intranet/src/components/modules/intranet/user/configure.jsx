import React, { Component } from 'react';

import Information from './../../../render/intranet/user/configure/information_user.jsx';
import Buttons_action from './../../../render/intranet/user/configure/button_action.jsx';
import global from '../../../../../providers/global.static.jsx';
import Header from '../../../render/all/mainHeader.jsx';
import Table from '../../../render/intranet/user/configure/table.jsx'

import './../../../../sass/modules/intranet/user/configure.sass'


class Configure extends Component{
    constructor(){
        super();
        this.state = {
            full_name : null,
            role_name : null,
            user_name : null,
            viewTiming: null,
            timing    : 0,
            data      : null
        }
        Promise.all([this.firstFetch(),this.secondFetch(),this.thirthFetch()]).then((rpta)=>{
            console.log(rpta);
        },reason => {
            console.log(reason);
        });
    }
    thirthFetch(){
        return new Promise((resolve)=>{
            fetch(global.URLBASESERVICE + "/user/get_users",{
                method : 'POST',
                credentials : 'include'
            })
            .then((response)=>{
                return response.json();
            })
            .then((rpta)=>{
                resolve(rpta);
                this.setState({data:rpta})
            })
        });
    }
    secondFetch(){
        return new Promise((resolve)=>{
            fetch(global.URLBASESERVICE + "/user/get_block",{
                method: 'POST',
                credentials: 'include'
            })
            .then((response)=>{
                return response.json();
            })
            .then((rpta)=>{
                resolve(rpta);
                switch (rpta.message) {
                    case "block":
                        this.setState({viewTiming:true,timing:rpta.time});
                        $('input').removeClass('invalid');
                        $('input').removeClass('valid');
                        $('input').attr("disabled","disabled");
                        break;
                    case "false":
                        this.setState({viewTiming:false,timing:rpta.time});
                        break;
                    case "true":
                        this.setState({viewTiming:false});
                        break;

                }
            })
        });

    }
    firstFetch(){
        return new Promise((resolve)=>{
            fetch(global.URLBASESERVICE + "/user/data_in_cookie", {
                method: 'POST',
                credentials: "include"
            })
            .then((response) => {
                return response.json();
            })
            .then((rpta) =>{
                resolve(rpta);
                this.setState({full_name : rpta.full_name,role_name:rpta.role_name,user_name:rpta.user_name})
            });
        });
    }
    render(){
        if (this.state.full_name != null && this.state.viewTiming != null && this.state.data != null) {
            return(
                <div className="user_view">
                    <Header
                        selected = {4}
                    />
                    <div className="main_group_user_profile">
                        <div className="content_view">
                            <h3 className="title">Configuración</h3>
                            <Information
                                full_name = {this.state.full_name}
                                role_name = {this.state.role_name}
                                user_name = {this.state.user_name}
                            />
                            <Buttons_action
                                user_name={this.state.user_name}
                                viewTiming={this.state.viewTiming}
                                timing={this.state.timing}
                                role_name={this.state.role_name}
                            />
                            {(()=>{
                                if (this.state.role_name != "EDITOR") {
                                    return(
                                        <Table
                                            data = {this.state.data}
                                            user_name={this.state.user_name}
                                            role_name={this.state.role_name}
                                        />
                                    )
                                }
                            })()}
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div></div>
            )
        }
    }
}

export default Configure;
