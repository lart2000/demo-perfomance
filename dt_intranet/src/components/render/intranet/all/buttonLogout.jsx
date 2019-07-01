import React,{ Component } from "react";
import Exit from "./../../../../icons/svg_exit.svg";
import global from "./../../../../../providers/global.static";
class ButtonLogout extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <button className="content_data content_logout z-depth-3" onClick={this.logout}>

                Cerrar sesión
                <Exit/>
            </button>
        );
    }
    logout(){
        fetch(global.URLBASESERVICE+"/logout",{
            method: 'POST',
            credentials: "include",
        })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((rpta) => {
            console.log(rpta);
            if(rpta ){
                document.location.href="/"
            }
        });
    }
}

export default ButtonLogout;
