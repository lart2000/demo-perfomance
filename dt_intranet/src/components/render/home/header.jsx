import React, { Component } from 'react';

import global from '../../../../providers/global.static.jsx';

class Header extends Component {
    constructor(props){
        super(props);
        

        this.src=this.props.src_logo;
        // this.timing_logo=this.timing_logo.bind(this);
        
    }
    // componentDidMount(){
    //     this.timing_logo();
    // }
    render() {
        return (
            <header class="content_header">
                <div class="content_hs">
                    <h1>Grados y Títulos</h1>
                    <h2>Sistema de verificación de Tesis</h2>
                </div>
                <img  src={this.src} alt="imagen_UNJFSC" title="img_logo"/>
            </header>
            
            
        );
    }
    // timing_logo(){
    //     $("img").addClass("show")
        
    // }

}

export default Header;