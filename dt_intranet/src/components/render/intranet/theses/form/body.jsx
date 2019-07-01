import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as action from '../../../../../redux/actions/intranet/theses/form';
import global from '../../../../../../providers/global.static.jsx';

import SvgCalendar from '../../../../../icons/svg_calendar.svg';

import ItemGroup from './itemGroup.jsx';
import Buttons from './buttons.jsx';

import Utils from '../../../../utils/utils.jsx';

class Body extends Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeCode  = this.onChangeCode.bind(this);

        this.state = {
            schoolsList: [], // escuelas para el select
            chargeList : [],
            title      : this.props.dataForm.title_thesis,
            code       : this.props.dataForm.code
        };
    }

    componentDidMount(){
        this.fetchGetSchools();
        this.fetchGetCharges();
        $('.datepicker').pickadate({
            selectMonths: true,
            selectYears : 15
        });
        let deteLiftDOM = $("#date_lift");
        deteLiftDOM.val(this.props.dataForm.date_lift);
        deteLiftDOM.on("change",(event)=>{
            this.props.changeDataTxtForm("date_lift", event.target.value);
        });
    }

    fetchGetSchools() {
        fetch(global.URLBASESERVICE + "/school", {
            method: 'POST',
            credentials: "include"
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            this.setState({ schoolsList: rpta });
        });
    }

    fetchGetCharges() {
        fetch(global.URLBASESERVICE + "/charge", {
            method: 'POST',
            credentials: "include"
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            this.setState({ chargeList: rpta });
        });
    }

    onChangeTitle(event){
        let title = event.target.value;
        this.props.changeDataTxtForm("title_thesis", title);
        this.setState({title});
    }
    onChangeCode(event){
        let code = event.target.value;
        this.props.changeDataTxtForm("code", code);
        this.setState({code});
    }

    render() {
        let dataForm = this.props.dataForm;
        let id = dataForm.id;
        return (
            <div className="body_view_form_thesis">
                <h1>{(id !== undefined ? "Editar" : "Añadir una" ) + " Tesis"}</h1>
                <div className="content_group z-depth-3">
                    <div className="title_count_group">
                        <span>Tesis</span>
                    </div>
                    <div class="input-field inp_thesis">
                        <input id="thesis" type="text"
                                value={this.state.title}
                                onChange={this.onChangeTitle}/>
                        <label for="thesis">Nombre de Tesis</label>
                    </div>
                    <div className="complements">
                        <div class="complement_thesis">
                            <input id="thesis" type="text"
                                value={dataForm.code} placeholder="Código de Tesis"
                                onChange={this.onChangeCode} />
                        </div>
                        <div class="complement_thesis">
                            <input id="date_lift" type="text" class="datepicker" placeholder="Publicación"/>
                            <div className="icon">
                                <SvgCalendar/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {(()=>{
                        if(this.state.schoolsList.length != 0){
                            return <ItemGroup title="Autor(es)" baseId="author"
                                arrayData={this.state.schoolsList}
                                titleSelect={"Escuela"}/>;
                        }
                    })()}
                    <ItemGroup title="Asesor(es)" baseId="adviser"/>
                    {(()=>{
                        if(this.state.chargeList.length != 0){
                            return <ItemGroup title="Jurado(s)" baseId="jury"
                                arrayData={this.state.chargeList}
                                titleSelect={"Cargo"}/>;
                        }
                    })()}
                </div>
                <Buttons/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let data = state.dataFormTheses;
    return { dataForm: data }
};

export default connect(mapStateToProps, action)(Body);
