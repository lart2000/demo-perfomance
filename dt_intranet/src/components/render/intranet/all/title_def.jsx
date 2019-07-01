import React, { Component } from 'react';

class Title extends Component {
    constructor(props){
        super(props);
        this.titleTxt = props.title;
    }
    render() {
        return (
            <div className="title_def">
                <span>{this.titleTxt}</span>
            </div>
        );
    }
}

export default Title;
