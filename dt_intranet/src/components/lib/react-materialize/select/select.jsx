import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

//import global from '../../../../../../providers/global.static.jsx';


//is necesary this.props.id ,this.props.options, this.props.placeHolder
class Select extends Component {
    constructor(props) {
        super(props);
        this.state={};
        //this.state=this.props;
        //console.log(this.props.options);
        for (const key in this.props) {
            if (this.props.hasOwnProperty(key)) {
                this.state[key]=this.props[key];
                
            }
        }
        this.options=this.state.options;
        this.placeHolder=this.state.placeHolder
        this.onChange = this.state.onChange;
        delete this.state.placeHolder;
        delete this.state.options;
        delete this.state.onChange;
        this.placeHolder=
            {
                //"data-icon":"images/example.png",
                text: this.placeHolder,
                value:"",
                className:"left circle",
                key:"placeHolder"
            }
        
    }
    componentDidMount(){
        $(document).ready(()=>{
            
            $(`#${this.state.id}`).material_select();
            let id = document.getElementById(`${this.state.id}`).getAttribute("data-select-id");
            //let ul = document.getElementById(`select-options-${id}`);
            //let li = ul.firstChild;
            //let span=li.firstChild.setAttribute("style","color:#90a4ae;");
            
            $(`select[id="${this.state.id}"]`).on("change",(e)=>{
                console.log("entro");
                // this.paintColor("#90a4ae",id)
                this.onChange(e)
            });
            
            // this.paintColor("#90a4ae",id);
           
        });
        
        
    }
    componentDidUpdate(){
        $(document).ready(()=>{
            $(`#${this.state.id}`).material_select();
            let id = document.getElementById(`${this.state.id}`).getAttribute("data-select-id");
            let ul = document.getElementById(`select-options-${id}`);
            let li = ul.firstChild;
            //let span=li.firstChild.setAttribute("style","color:#90a4ae;");
            // this.paintColor("#90a4ae",id);
           
        });
    }
    // paintColor(color,id){
    //     let options = document.getElementById(`${this.state.id}`).firstChild.value;
    //     let select = document.getElementById(`${this.state.id}`).value
    //     // if(select==options){
    //     //     $(`input[data-activates="select-options-${id}"]`).attr("style","color:"+color+";text-align: center;") ;
    //     $($(".caret")[0]).attr("style","background: white; height: 30px;width: 10px;opacity:1;display: flex;z-index : 1200;align-items: center")
    //     // }else{
    //         $(`input[data-activates="select-options-${id}"]`).attr("style","text-align: center;") ;
    //     // }
    // }
    componentWillUpdate(nextProps,nextState){
        //console.log("entro a will update")
        this.options=nextState.options;
        this.placeHolder=nextState.placeHolder
        this.onChange=nextState.onChange
        delete nextState.onChange;
        delete nextState.placeHolder;
        delete nextState.options;
        this.placeHolder=
            {
                //"data-icon":"images/example.png",
                text: this.placeHolder,
                value:"",
                className:"left circle",
                key:"placeHolder"
            }
        
    }
    
    componentWillReceiveProps(nextProps){
        //console.log("esta cambiando los props")
        let nextState={};
        nextState=nextProps;
        //console.log(nextProps)
        this.setState(nextState);
    }
    
    
    render() {
        
        return (
            <div className="content_select input-field">
                {
                    (()=>{
                        let arrayOptions=[];
                        arrayOptions.push(React.createElement('option',this.placeHolder,this.placeHolder.text));    
                        for (const value of this.options) {//typeof value=={}
                            //console.log(value)
                            arrayOptions.push(React.createElement('option',value,value.text))//falta quitar ciertos tags del objeto pero funciona :)
                        }
                        return React.createElement('select', this.state,arrayOptions);
                    })()
                }
                <label>{this.state.label}</label>
            </div>
            
            //  <select id="organizer" className="icons" name="organizer">
            //     <option value=""></option>
            //     <option value="" data-icon="images/sample-1.jpg" className="left circle" >example 1</option>
            //     <option value="" data-icon="images/office.jpg" className="left circle">example 2</option>
            //     <option value="" data-icon="images/yuna.jpg" className="left circle">example 3</option>
            // </select>
         );
    }
}

export default Select;