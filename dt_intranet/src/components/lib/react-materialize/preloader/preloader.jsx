import React, { Component } from 'react';
//import global from '../../../../../../providers/global.static.jsx';

//size : small|normal|<big></big>
//color : red|green|yellow|blue
class Preloader extends Component {
    
    constructor(props) {
        super(props);
        this.color= this.props.color;
        this.size= this.props.size=="normal"?"":this.props.size;
    }
    render() {
        return (
            <div className={`preloader-wrapper ${this.size} active`}>
                <div className={`spinner-layer spinner-${this.color}-only`}>
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
         );
    }
}

export default Preloader;