import React, { Component } from 'react';

import IconEdit from './../../../../../icons/svg_edit.svg';
import global from '../../../../../../providers/global.static.jsx';

class InfomationUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            full_name: this.props.full_name,
            role_name: this.props.role_name,
            user_name: this.props.user_name,
            status: false
        }
    }
    componentDidMount(){

        $(document).ready(function () {
            $('form').keypress(function (e) {
                if (e == 13) {
                    return false;
                }
            });
            $('input').keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
    }
    render() {
        if (this.state.full_name != null) {
            return (
                <div className="first_part_view_user">
                    <form className="form_name">
                        <div className="input-field col s6">
                            <span className="name">
                                {this.state.full_name}
                            </span>
                            <input type="text" className="name not_visible" defaultValue={this.state.full_name}/>
                            <div className="icon"
                                onClick = {
                                    (e)=>{
                                        let name = $('.name');
                                        let input_name = $('input.name');
                                        let role_name = $('span.user_role');
                                        let span_name = $('span.name');
                                        if (!this.state.status) {
                                            name.addClass('not_visible');
                                            input_name.removeClass('not_visible');
                                            this.setState({status:true});
                                        } else {
                                            name.addClass('not_visible');
                                            span_name.removeClass('not_visible');
                                            this.setState({ status: false });
                                            if (input_name.val() != this.state.full_name && input_name.val() != "") {
                                                let data = new FormData();
                                                data.append("name", input_name.val());
                                                data.append("user_name", this.state.user_name);
                                                fetch(global.URLBASESERVICE + "/user/change_name_user", {
                                                    method: 'POST',
                                                    credentials: "include",
                                                    body: data
                                                })
                                                .then((response) => {
                                                    return response.json();
                                                })
                                                .then((rpta) => {
                                                    if (rpta != "") {
                                                        this.setState({full_name:rpta})
                                                        Materialize.toast('Se cambió el nombre de manera adecuada', 4000);
                                                    }else{
                                                        Materialize.toast('No se pudo realizar el cambio de nombre', 4000);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            >
                                <IconEdit />
                            </div>
                        </div>
                        <div className="role">
                            <span className="rol">CARGO:</span>
                            <span className="user_role">
                                {this.state.role_name}
                            </span>
                        </div>
                    </form>
                </div>
            );
        }else{
            return <div></div>
        }

    }

}

export default InfomationUser;
