import React, { Component } from 'react'
import Svg_add from './../../../../../icons/svg_add.svg';
class ButtonFloating extends Component{

    constructor(props){
        super(props)
    }
    componentDidMount(){
    }
    render(){
        return (
            <div class="fixed-action-btn">
                <a class="btn-floating btn-large orange modal-trigger"  
                        href="#modal_jury" 
                        onClick={()=>{this.props.setJuryId( {name : undefined,last_name: undefined,school_id: undefined});
                                    this.props.setModalMode("create");}}>
                    <Svg_add className="large material-icons svg_icon"/>
                </a>
            </div>
        );
    }
    


}
export default ButtonFloating;


