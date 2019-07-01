import React, { Component } from 'react';

import IconExit from '../../../icons/svg_close.svg';
import MenuData from "./menu.json";

class LateralMenu extends Component {
    constructor(props) {
        super(props);
        this.menu    = MenuData.menu;

        this.selected    = props.selected;
        this.openMenu    = props.openMenu;
        this.fnCloseMenu = props.fnCloseMenu;
    }

    componentWillUpdate(props){
        this.openMenu = props.openMenu;
    }

    render() {
        let classHidden = !this.openMenu ? "hidden":"";
        return (
            <div className={"lateral_menu " + classHidden}>
                <div className="content_menu">
                    <div className="content_close">
                        <div className="icon_exit" onClick={this.fnCloseMenu}>
                            <IconExit/>
                        </div>
                    </div>
                    {(()=>{
                        return this.menu.map((el,i)=>{
                            let selectedClass = (this.selected == i) ? "selected":"";
                            if (this.selected == i){
                                return <div className={"item_menu " + selectedClass}>
                                    <span className="no-seleccionable">{el.title}</span>
                                </div>;
                            }
                            return <a className={"item_menu " + selectedClass} href={el.url}>
                                <span className="no-seleccionable">{el.title}</span>
                            </a>;
                        });
                    })()}
                </div>
                <div className="previous_background" onClick={this.fnCloseMenu}>
                </div>
            </div>
        )
    }
}
export default LateralMenu;
