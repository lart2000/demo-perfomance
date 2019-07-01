import React, { Component } from 'react';

import IconClose from './../../../../../icons/svg_close.svg';
import global from '../../../../../../providers/global.static';
import Countdown from 'react-countdown-now';

class Button_Action extends Component {
    constructor(props){
        super(props);
        this.rectangule = null;
        this.form_add_user = null;
        this.form_change_password = null;
        this.role_name = this.props.role_name;
        this.state = {
            change_pass        : "",
            change_new_pass    : "",
            change_confirm_pass: "",
            add_name           : "",
            add_name_user      : "",
            add_confirm_pass   : "",
            status_pass        : false,
            status_pass_new    : false,
            status_pass_current: false,
            user_name          : this.props.user_name,
            viewTiming         : this.props.viewTiming,
            timing             : this.props.timing,
            message_warning    : ""
        }
    }
    componentDidMount(){
        this.rectangule           = $('div.thir_part');
        this.form_add_user        = $('form.form_add_user');
        this.form_change_password = $('form.form_change_pass');
        this.forms                = $('form');
        this.span_warning         = $('span#span_warning');
        this.count                = 0;
        this.rectangule.hide();
        this.span_warning.hide();
        $(document).ready(function () {
            $('select').material_select();
        });
    }
    change_pass(e){
        e.preventDefault();
        this.rectangule.show();
        this.forms.removeClass('not_visible');
        this.forms.addClass('not_visible');
        this.form_change_password.removeClass('not_visible');
    }
    add_user(e){
        e.preventDefault();
        this.rectangule.show();
        this.forms.removeClass('not_visible');
        this.forms.addClass('not_visible');
        this.form_add_user.removeClass('not_visible');
    }

    validateCurrentPassword(){
        if (this.state.change_pass.value != "") {
            let data = new FormData();
            data.append("password",this.state.change_pass.value);
            data.append("user_name", this.state.user_name);
            fetch(global.URLBASESERVICE + "/user/validate_current_password",{
                method : "POST",
                credentials:'include',
                body:data
            })
            .then((response)=>{
              return response.json();
            })
            .then((rpta)=>{
                switch (rpta.message) {
                    case "warning":
                        if (this.count == 0) {
                            this.setState({ message_warning:"2 intentos restantes"})
                            this.count ++;
                        }else{
                            this.setState({ message_warning: "1 intento restante"})
                            this.count = 0;
                        }
                        $('input#last_passsword').removeClass('valid');
                        $('input#last_passsword').addClass('invalid');
                        this.span_warning.show();
                        break;
                    case "block":
                        this.span_warning.hide();
                        this.setState({viewTiming:true,timing:rpta.time});
                        $('input').removeClass('invalid');
                        $('input').removeClass('valid');
                        $('input').attr("disabled","disabled");
                        break;
                    case "true":
                        this.span_warning.hide();
                        $('input#last_passsword').removeClass('invalid');
                        $('input#last_passsword').addClass('valid');
                        this.setState({ status_pass_current:true});
                        break;
                    case "false":
                        this.span_warning.hide();
                        $('input#last_passsword').removeClass('valid');
                        $('input#last_passsword').addClass('invalid');
                        break;
                }
            });
        }
    }

    validatePassword(pass){
        if (pass != "") {
            var cont = 0;
            var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';
            for (var i = 0; i < pass.length; i++)
                if (filtro.indexOf(pass.charAt(i)) != -1){
                    cont ++
                }
            if (cont == pass.length) {
                for (var i = 0; i < pass.length; i++)
                    if (!isNaN(pass.charAt(i))) {
                        this.setState({ status_pass:true});
                        return true;
                    }
            }
            return false;
        }
        return 1;
    }
    validatePassWithNew(e){
        if (this.state.change_confirm_pass.value != "" && this.state.change_new_pass.value != "") {
            if (this.state.change_confirm_pass.value === this.state.change_new_pass.value) {
                $('input#repeat_pass').removeClass('invalid');
                $('input#repeat_pass').addClass('valid');
                this.setState({ status_pass_new:true});
            }else{
                $('input#repeat_pass').removeClass('valid');
                $('input#repeat_pass').addClass('invalid');
                this.setState({ status_pass_new: false });
            }
        }
    }
    send_change_pass(e){
        e.preventDefault();
        if (this.state.change_pass.value != "" && this.state.change_new_pass.value != "" && this.state.change_confirm_pass.value != "") {
            console.log(this.state.status_pass_new);
            if (this.state.status_pass_new && this.state.status_pass && this.state.status_pass_current) {
                let data = new FormData();
                data.append("new_pass", this.state.change_confirm_pass.value);
                data.append("user_name", this.state.user_name);
                fetch(global.URLBASESERVICE + "/user/change_password",{
                    method: 'POST',
                    credentials:'include',
                    body:data
                })
                .then((Response)=>{
                    return Response.json();
                }).then((rpta)=>{
                    if (rpta) {
                        Materialize.toast('Se realizó el cambio de contraseña', 4000);
                        this.state.add_confirm_pass.value    = "";
                        this.state.change_confirm_pass.value = "";
                        this.state.change_new_pass.value     = "";
                        this.state.add_name.value            = "";
                        this.state.change_pass.value         = "";
                        $('input').removeClass('valid');
                        $('input').removeClass('invalid');
                        $('input').focus();
                        $('input').blur();
                    } else {
                        Materialize.toast('Hubo algún error inténtelo más tarde', 4000);
                    }
                });
            }else{
                Materialize.toast('¡Corrija los campos con error!', 4000);
            }
        }else{
            Materialize.toast('¡Debe completar los campos!', 4000);
        }
    }
    send_add_user(e) {
        e.preventDefault();
        let SelectVal = $('div.select-wrapper').children('ul').children('li.selected').text();
        if (this.state.add_name.value != "" && this.state.add_name_user.value != "" && SelectVal != "" && this.state.add_confirm_pass != "") {
            let data = new FormData();
            data.append("full_name",this.state.add_name.value);
            data.append("name_user",this.state.add_name_user.value);
            data.append("password",this.state.add_confirm_pass.value);
            data.append("role",SelectVal);
            fetch(global.URLBASESERVICE + "/user/add_user",{
                method : 'POST',
                credentials : 'include',
                body : data
            })
            .then((response)=>{
                return response.json()
            })
            .then((rpta)=>{
                if (rpta) {
                    Materialize.toast('Se añadió el usuario correctamente', 4000);
                    this.state.add_confirm_pass.value    = "";
                    this.state.change_confirm_pass.value = "";
                    this.state.change_new_pass.value     = "";
                    this.state.add_name.value            = "";
                    this.state.change_pass.value         = "";
                    $('input').removeClass('valid');
                    $('input').removeClass('invalid');
                    $('input').focus();
                    $('input').blur();
                } else {
                    Materialize.toast('Ocurrió un error intente más tarde', 4000);
                }
            })
        } else {
            Materialize.toast('Debe completar los campos', 4000);
        }
    }
    render() {
        return (
            <div className="button_action">
                <div className="buttons_part_view_user">
                    <button className="button_design" id="change_password"
                            onClick = {(e)=>this.change_pass(e)}
                            >Cambiar Contraseña</button>
                    {(()=>{
                        if (this.role_name === 'SUPER ADMINISTRADOR' || this.role_name === 'ADMINISTRADOR') {
                            return(
                                <button className="button_design" id="add_user"
                                        onClick={(e) => this.add_user(e)}
                                        >Agregar Usuario</button>
                            )
                        }
                    })()
                    }
                </div>
                <div class="thir_part">
                    <div className="close_icon"
                        onClick={()=>{
                            this.state.add_confirm_pass.value    = "";
                            this.state.change_confirm_pass.value = "";
                            this.state.change_new_pass.value     = "";
                            this.state.add_name.value            = "";
                            this.state.change_pass.value         = "";
                            $('input').removeClass('valid');
                            $('input').removeClass('invalid');
                            $('input').focus();
                            $('input').blur();
                            $('div.thir_part').hide();
                        }}
                    >
                        <IconClose/>
                    </div>
                    <div className="rectangule_user_view z-depth-2">
                        <form action="" className="form_change_pass not_visible">
                            <div className="form_on">
                                <div className="input-field inp_short">
                                    <input id="last_passsword" type="password"
                                        ref={(input) => { this.state.change_pass = input;}}
                                        onBlur={()=>{
                                            this.validateCurrentPassword();
                                        }}
                                    />
                                    <label id="label_error" for="last_passsword" data-error="Incorrecto" data-success="Correcto">Contraseña Actual</label>
                                    <span id="span_warning">{this.state.message_warning}</span>
                                    {(()=>{
                                        if (this.state.viewTiming) {
                                            const Completionist = () => {
                                                this.setState({ viewTiming: false });
                                                this.state.change_pass = "";
                                                $('input').focus();
                                                $('input').blur();
                                                $('input').prop("disabled", false);
                                                return(
                                                    <span>Adios</span>
                                                )
                                            }
                                            return(
                                                <Countdown date={Date.now() + this.state.timing}>
                                                    <Completionist/>
                                                </Countdown>
                                            )
                                        }
                                    })()}
                                </div>
                                <div className="input-field inp_short">
                                    <input id="new_password" type="password"
                                        ref={(input) => { this.state.change_new_pass = input;}}
                                        onKeyUp = {(e)=>{
                                            let status = this.validatePassword(this.state.change_new_pass.value);
                                            if (status === true) {
                                                $('input#new_password').removeClass('invalid');
                                                $('input#new_password').addClass('valid');
                                            }
                                            if (status === false) {
                                                $('input#new_password').removeClass('valid');
                                                $('input#new_password').addClass('invalid');
                                            }
                                            this.validatePassWithNew(e);
                                        }}
                                        onBlur={(e) => {
                                            console.log("en el blur");
                                            let status = this.validatePassword(this.state.change_new_pass.value);
                                            if (status === true) {
                                                $('input#new_password').removeClass('invalid');
                                                $('input#new_password').addClass('valid');
                                            }
                                            if (status === false) {
                                                console.log("en el false");
                                                $('input#new_password').removeClass('valid');
                                                $('input#new_password').addClass('invalid');
                                            }
                                            this.validatePassWithNew(e);
                                        }}
                                            />
                                    <label for="new_password" data-error="Incorrecto" data-success="Correcto">Nueva Contraseña</label>
                                </div>
                                <div className="input-field inp_short">
                                    <input id="repeat_pass" type="password"
                                        ref={(input) => { this.state.change_confirm_pass = input;}}
                                        onKeyUp = {(e)=>{
                                            this.validatePassWithNew(e);
                                        }}
                                        onBlur={(e) => { this.validatePassWithNew(e);}}
                                            />
                                    <label for="repeat_pass" data-error="Incorrecto" data-success="Correcto">Repetir contraseña</label>
                                </div>
                            </div>
                            <button className="button_design"
                                    onClick = {(e)=>{this.send_change_pass(e)}}
                                    >Guardar</button>
                        </form>
                        <form action="" className="form_add_user not_visible">
                            <div className="form_on">
                                <div className="input-field inp_short">
                                    <input id="name" type="text" className="validate"
                                        ref={(input) => { this.state.add_name = input;}}
                                            />
                                    <label for="name" data-error="Incorrecto" data-success="Correcto">Nombre</label>
                                </div>
                                <div className="input-field inp_short">
                                    <input id="user_name" type="text" className="validate"
                                        ref={(input) => { this.state.add_name_user = input;}}
                                            />
                                    <label for="user_name" data-error="Incorrecto" data-success="Correcto">Nombre de usuario</label>
                                </div>
                                <div className="input-field inp_short">
                                    <input id="password" type="password"
                                        ref={(input)=>{this.state.add_confirm_pass = input;}}
                                        onKeyUp={()=>{
                                            let status = this.validatePassword(this.state.add_confirm_pass.value);
                                            if (status === true) {
                                                $('input#password').removeClass('invalid');
                                                $('input#password').addClass('valid');
                                            }
                                            if (status === false) {
                                                $('input#password').removeClass('valid');
                                                $('input#password').addClass('invalid');
                                            }
                                        }}
                                            />
                                    <label for="password" data-error="Incorrecto" data-success="Correcto">Contraseña</label>
                                </div>

                                <div className="input-field col s12">
                                    {
                                        (()=>{
                                            switch (this.role_name) {
                                                case "SUPER ADMINISTRADOR":
                                                    return(
                                                        <select>
                                                            <option value="0" disabled selected>Elige un rol</option>
                                                            <option value="1">ADMINISTRADOR</option>
                                                            <option value="2">EDITOR</option>
                                                        </select>
                                                    )
                                                    break;
                                                case "ADMINISTRADOR":
                                                    return(
                                                        <select>
                                                            <option value="2" disabled selected>EDITOR</option>
                                                        </select>
                                                    )
                                                    break;
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                            <button className="button_design"
                                    onClick = {(e)=>{this.send_add_user(e)}}
                                    >Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Button_Action;
