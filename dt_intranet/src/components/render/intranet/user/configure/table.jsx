import React, { Component } from 'react';
import Svg_edit from './../../../../../icons/svg_edit.svg'
import Svg_delete from './../../../../../icons/svg_delete.svg'
import global from '../../../../../../providers/global.static.jsx'

class Table extends Component{
    constructor(props){
        super(props);
        this.state = {
            data     : this.props.data,
            user_name: this.props.user_name,
            role_name: this.props.role_name
        }
    }
    componentDidMount(){
        $(document).ready(()=>{
            this.state.data.forEach(element => {
                if (element.status == 1) {
                    $('.'+element.user_name).find("input[type=checkbox]").prop('checked',true);
                } else {
                    $('.'+element.user_name).find("input[type=checkbox]").prop('checked',false);
                }
            });
            let swtichObject = $(".switch").find("input[type=checkbox]");
            console.log(swtichObject);
            swtichObject.on("change",function() {
                var status = $(this).prop('checked');
                var user_name = $(this).prop('id');
                console.log(user_name,status);
                let statusID = null;
                if (status) {
                    statusID = 1;
                }else{
                    statusID = 0;
                }
                let data = new FormData();
                data.append("name_user",user_name);
                data.append("status",statusID);
                fetch(global.URLBASESERVICE + "/user/status",{
                    method : 'POST',
                    credentials :'include',
                    body : data
                })
                .then((response)=>{
                    return response.json();
                })
                .then((rpta)=>{
                    if (rpta) {
                        Materialize.toast('Se cambio el estado del usuario', 4000);
                    } else {
                        Materialize.toast('¡Ocurrió un error!', 4000);
                    }
                })
            });
        })
    }
    render(){
        return(
            <div className="table_user">
                    <table className="highlight centered">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Habilitar</th>
                            <th>Opciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {(()=>{
                                if (this.state.data != null) {
                                    let element = this.state.data.map((element,key) => {
                                        if (this.state.role_name != "SUPER ADMINISTRADOR" && (element.role_name == "SUPER ADMINISTRADOR" || element.role_name == "ADMINISTRADOR")) {
                                            return false;
                                        }
                                        return(
                                            <tr key={element.user_name}>
                                                <td>{element.full_name}</td>
                                                <td>{element.role_name}</td>
                                                <td>
                                                    {(()=>{
                                                        if (this.state.user_name != element.user_name) {
                                                            return(
                                                                <div className={"switch "+element.user_name}>
                                                                    <label>
                                                                    Off
                                                                    <input type="checkbox" id={element.user_name}/>
                                                                    <span className="lever"></span>
                                                                    On
                                                                    </label>
                                                                </div>
                                                            )
                                                        } else {
                                                            return(
                                                                <div className={"switch "+element.user_name}>
                                                                    <label>
                                                                    Off
                                                                    <input type="checkbox" disabled id={element.user_name}/>
                                                                    <span className="lever"></span>
                                                                    On
                                                                    </label>
                                                                </div>
                                                            )
                                                        }
                                                    })()}
                                                </td>
                                                <td>
                                                    {(()=>{
                                                        if (this.state.user_name != element.user_name) {
                                                            return(
                                                                <div className="options">
                                                                    <Svg_edit
                                                                        className = "svg"
                                                                    />
                                                                    <Svg_delete
                                                                        className = "svg"
                                                                    />
                                                                </div>
                                                            )
                                                        }else{
                                                            return(
                                                                <span>Este eres tú</span>
                                                            )
                                                        }
                                                    })()}

                                                </td>
                                            </tr>
                                        )
                                    });
                                    return element;
                                }
                                else{
                                    <div></div>
                                }
                            })()}
                        </tbody>
                    </table>
                </div>
            )
    }
}
export default Table;
