import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as action from '../../../../redux/actions/intranet/theses/form';
import global from '../../../../../providers/global.static.jsx';

import Header from '../../../render/all/mainHeader.jsx';
import Body from '../../../render/intranet/theses/form/body.jsx';

import Utils from '../../../utils/utils.jsx';

import '../../../../sass/modules/intranet/theses/form.sass';

class form extends Component {
    constructor(props){
        super(props);
        this.utils = new Utils();

        this.id = props.match.params.id;
        props.setThesesID(this.id);

        this.state = {
            isEdit    : this.id !== undefined,
            isLoading : true
        };
        if (this.id !== undefined){
            this.getAllDataTheses();
        }
    }

    getAllDataTheses(){
        const formData = new FormData();
        formData.append("id", this.id);
        fetch(global.URLBASESERVICE + "/theses/get_data_edit", {
            method     : "POST",
            credentials: "include",
            body       : formData
        })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            let thesis = JSON.parse(response.thesis);
            this.props.changeDataTxtForm("title_thesis", thesis.name);
            this.props.changeDataTxtForm("code", thesis.code);
            let dateLift = thesis.date_lift.substring(0, 10);
            dateLift = this.utils.getStringToDatepicker(dateLift);
            this.props.changeDataTxtForm("date_lift", dateLift);
            let authors = JSON.parse(response.authors);
            this.props.setDataArrayForm("author", JSON.parse(response.authors));
            let advisers = JSON.parse(response.advisers);
            this.props.setDataArrayForm("adviser", JSON.parse(response.advisers));
            let juries = JSON.parse(response.juries);
            this.props.setDataArrayForm("jury", JSON.parse(response.juries));
            this.setState({
                isLoading: false
            });
        }).catch(()=>{
            Materialize.toast('¡Ha ocurrido un error!', 1000);
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        });
    }

    render() {
        return (
            <div className="view_form_thesis">
                <Header/>
                {(()=>{
                    if(this.state.isEdit && this.state.isLoading){
                        return <div className="big_preloading_page">
                            <div className="preloader-wrapper super_big active">
                                <div className="spinner-layer spinner-blue-only">
                                    <div className="circle-clipper left">
                                        <div className="circle"></div>
                                    </div><div className="gap-patch">
                                        <div className="circle"></div>
                                    </div><div className="circle-clipper right">
                                        <div className="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>;
                    }else{
                        return <Body />;
                    }
                })()}
            </div>
        );
    }
}

export default connect(null, action)(form);
