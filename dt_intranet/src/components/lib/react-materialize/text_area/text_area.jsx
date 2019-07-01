import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

//import global from '../../../../../../providers/global.static.jsx';

//is necesary this.props.id and this.props.label
class TextArea extends Component {
    constructor(props) {
        super(props);
        this.state={};
        
        for (const key in this.props) {
            if (this.props.hasOwnProperty(key)) {
                this.state[key]=this.props[key];
                
            }
        }
        this.state.className="materialize-textarea";
        
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
                    React.createElement('textarea', this.state,null )
                }
                <label htmlFor={this.state.id}>{this.state.label}</label>
            </div>
                
        );
    }
}

export default TextArea;