import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

//is necesary this.props.id and this.props.label
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state={};
        
        for (const key in this.props) {
            if (this.props.hasOwnProperty(key)) {
                this.state[key]=this.props[key];
                
            }
        }
        this.state.type="text"
        this.state.className="datepicker"
    }
    componentDidMount(){
        $(`#${this.state.id}`).pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            closeOnSelect: false, // Close upon selecting a date,
            container: undefined, // ex. 'body' will append picker to body
          });7
        
        $(`#${this.state.id}`).on("change",(e)=>{
            this.state.onChange(e);
        })
       

    }
    componentWillReceiveProps(nextProps){

        let nextState={};
        for (const key in nextProps) {
            if (nextProps.hasOwnProperty(key)) {
                nextState[key]=nextProps[key];
            }
        }
        this.setState(nextState);
    }
    
    
    render() {
        
        return (
            <div className="input-field">
                {
                    React.createElement('input', this.state,null )
                }
                <label htmlFor={ this.state.id}>{ this.state.label}</label>
            </div>
                
        );
    }
}

export default DatePicker;