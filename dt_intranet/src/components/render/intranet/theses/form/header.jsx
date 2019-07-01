import React, { Component } from 'react';

import global from '../../../../../../providers/global.static.jsx';

import InputList from './inpCoincidences.jsx';

import IconAdd from "../../../../../icons/svg_add.svg";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="header_theses z-depth-3 content_main_header">
                <div className="content_view_header">
                    <div className="content_title">
                        <h3>Grados y Títulos - Añadir Tesis</h3>
                    </div>
                </div>
            </div>
        )
    }

}
export default Header;