import React, { Component } from 'react'
import Svg_edit from './../../../../../icons/svg_edit.svg'
import Svg_delete from './../../../../../icons/svg_delete.svg'
export default class JuryRow extends Component {
    constructor(props){
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      return {}
    }
    render() {
        return (
            <div className="t_body_row"
                    key={this.props.element.id}>
                <span className="t_body_item">
                    {this.props.element.last_name}
                </span>
                <span className="t_body_item">
                    {this.props.element.name}
                </span>
                <span className="t_body_item">
                    <Svg_edit className="svg update modal-trigger"
                                href="#modal_jury"
                                onClick={this.onClick}/>
                    <Svg_delete className="svg delete modal-trigger"
                                    href="#modal_jury"
                                    onClick={this.onClick}/>
                </span>

            </div>
        )
    }
    onClick(e){
        console.log("si entro");
        this.props.setJuryId(this.props.element)
        if(e.target.classList.contains("update")){
            
            this.props.setModalMode("update")
        }else{
            this.props.setModalMode("delete")
        }
    }

}
