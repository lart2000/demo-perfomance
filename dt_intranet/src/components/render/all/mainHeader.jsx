import React, { Component } from 'react';

import IconSchool from '../../../icons/svg_school.svg';
import IconPerson from '../../../icons/svg_person.svg';
import IconMenu from '../../../icons/svg_menu.svg';

import LateralMenu from './lateralMenu.jsx';

import global from '../../../../providers/global.static.jsx';

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.onClickUser = this.onClickUser.bind(this);
        this.fnCloseMenu = this.fnCloseMenu.bind(this);

        this.withLateralMenu = this.existsValue(props.lateralMenu,true);
        this.selected        = this.existsValue(props.selected, null);

        let obj = {
            user    : false,
            openMenu: (false && this.withLateralMenu)
        };
        let nameCookie = "_sdat=";
        let cookies = document.cookie.split(";").filter((el) => { return el.trim().indexOf(nameCookie) === 0 });
        if (cookies.length !== 0) {
            this.getDataUser();
        }else{
            obj.user = null;
        }
        this.state = obj;
    }

    existsValue(param,defValue){
        if(param !== undefined){
            return param;
        }
        return defValue;
    }

    onClickUser(){
        let contentToolTip = $(".content_tooltip_my_user");
        contentToolTip.toggleClass("hidden");
    }

    openMenu(st){
        $("body").addClass("fixed");
        this.setState({openMenu: true});
    }

    fnCloseMenu(){
        $("body").removeClass("fixed");
        this.setState({
            openMenu: false
        });
    }

    render() {
        let myUser = this.state.user;
        return (
            <div className="main_header">
                <div className="content_aside">
                    {(() => {
                        switch (myUser) {
                            case null:
                                return null;
                            case false:
                                return null;
                            default:
                                if (this.withLateralMenu){
                                    return <LateralMenu openMenu={this.state.openMenu}
                                                        fnCloseMenu={this.fnCloseMenu}
                                                        selected={this.selected}/>;
                                }
                                return null;
                        }
                    })()}
                    {(()=>{
                        switch (myUser){
                            case null:
                                return null;
                            case false:
                                return null;
                            default:
                                if (this.withLateralMenu){
                                    let classHidden = !this.state.openMenu ? "" :"hidden";
                                    return <div className={"icon_menu " + classHidden}
                                                onClick={()=>{this.openMenu(!this.state.openMenu)}}>
                                        <IconMenu />
                                    </div>;
                                }
                                return null;
                        }
                    })()}
                </div>
                <div className="content_title">
                    <div className="icon_school">
                        <IconSchool/>
                    </div>
                    <h3>GRADOS Y TÍTULOS - UNJFSC</h3>
                </div>
                {(()=>{
                    switch (myUser) {
                        case null:
                            return <div className="content_aside content_start_session">
                                <a href="/iniciar_sesion" className="button_start">
                                    <label>Iniciar Sesión</label>
                                </a>
                                <div className="icon_unjfsc">
                                    <img src="/src/images/logo_unjfsc.png" alt="" />
                                </div>
                            </div>;
                        case false:
                            return <div className="content_aside">
                            </div>;
                        default:
                            let fullName = myUser.full_name.split(" ");
                            let initials = fullName[0].substring(0, 1) + fullName[1].substring(0, 1);
                            return <div className="content_aside content_my_user">
                                <div className="content_button_user" onClick={this.onClickUser}>
                                    <label className="no-seleccionable">{initials}</label>
                                    <div className="content_icon_user">
                                        <div className="icon_user">
                                            <IconPerson/>
                                        </div>
                                    </div>
                                </div>
                                <div className="content_tooltip_my_user hidden">
                                    <div className="title_fullname">
                                        <span className="no-seleccionable">{myUser.full_name}</span>
                                    </div>
                                    <div className="charge_detail">
                                        <span className="no-seleccionable">Cargo: {myUser.role_name}</span>
                                    </div>
                                    <div className="footer_buttons_tooltip">
                                        <a href="/configuracion" className="btn_tooltip_user waves-effect waves-light">
                                            <span className="no-seleccionable">Configuración</span>
                                        </a>
                                        <div className="btn_tooltip_user waves-effect waves-light" onClick={this.logout}>
                                            <span className="no-seleccionable">Cerrar Sesión</span>
                                        </div>
                                    </div>
                                </div>
                            </div>;
                    }
                })()}
            </div>
        )
    }

    getDataUser() {
        fetch(global.URLBASESERVICE + "/user/data_in_cookie", {
            method: 'POST',
            credentials: "include"
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            if (rpta === null){
                this.logout();
            }else{
                this.setState({
                    user: {
                        full_name: rpta.full_name,
                        role_name: rpta.role_name
                    }
                });
            }
        }).catch(() => {
            this.setState({
                full_name: "¡Ha ocurrido un error!",
                role_name: "Esperando...",
                color    : "error_cn"
            });
        });
    }

    logout() {
        fetch(global.URLBASESERVICE + "/logout", {
            method     : 'POST',
            credentials: "include",
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            if (rpta) {
                document.location.href = "/";
            }else{
                Materialize.toast('¡Ha ocurrido un error!', 4000);
            }
        });
    }
}
export default MainHeader;
