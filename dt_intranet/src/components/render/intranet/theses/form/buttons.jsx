import React, { Component } from 'react';
import { connect } from 'react-redux';

import global from '../../../../../../providers/global.static.jsx';
import utils from '../../../../utils/utils.jsx';

class ItemGroup extends Component {
    constructor(props) {
        super(props);
        this.utils = new utils();
        this.openConfirmSaved = this.openConfirmSaved.bind(this);
        this.sendToSave       = this.sendToSave.bind(this);

        this.state = {
            showConfirm : null,
            onSaving    : false
        };
    }

    componentDidMount(){
        $(document).ready(function () {
            $('.modal').modal();
        });
    }

    openConfirmSaved() {
        let currentData = this.props.dataFormTheses;
        if (!this.validateDataForm(currentData)){
            return false;
        }
        this.setState({showConfirm: true});
        $('#modal_confirm').modal('open');
    }

    sendToSave(){
        this.setState({onSaving: true});
        let theses = this.props.dataFormTheses,
            time   = theses.date_lift.split(" ");
        time[1] = this.utils.getMonthNumberByName(time[1].replace(",",""));
        time    = time[2] + "-" + time[1] + "-" + ("0" + time[0]).slice(-2);
        let isEdit = this.props.dataFormTheses.id !== undefined;
        let data = new FormData();
        if (isEdit){
            data.append("id", theses.id);
        }
        data.append("title", theses.title_thesis);
        data.append("code", theses.code);
        data.append("date_lift", time);
        data.append("author", JSON.stringify(theses.author));
        data.append("jury", JSON.stringify(theses.jury));
        data.append("adviser", JSON.stringify(theses.adviser));
        let typeSave = isEdit ? "update" :"create";
        fetch(global.URLBASESERVICE + "/theses/" + typeSave, {
            method     : 'POST',
            credentials: "include",
            body       : data
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            typeSave = isEdit ? "actualizó" :"creó";
            if(rpta){
                Materialize.toast('¡Se ' + typeSave+' correctamente!', 4000)
            }else{
                Materialize.toast('Ha ocurrido un error. ¡Reintente!', 4000)
            }
            setTimeout(()=>{
                window.location.href = "/";
            },2000);
        })
    }

    render() {
        return (
            <div className="buttons">
                <div className="button_design waves-effect" onClick={this.openConfirmSaved}>Continuar</div>
                <div id="modal_confirm" className="modal">
                    {(()=>{
                        if (this.state.showConfirm !== null){
                            return <li>
                                    <div class="title_header">
                                        <div class="title_item">
                                            <span>{this.props.dataFormTheses.title_thesis}</span>
                                        </div>
                                    </div>
                                    {this.getContentModalDetail()}
                                    {(()=>{
                                        if (this.state.onSaving) {
                                            return <div className="modal-footer preloader_saving">
                                                <div className="preloader-wrapper big active">
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
                                            let isEdit = this.props.dataFormTheses.id !== undefined;
                                            let word = isEdit ? "Actualizar" :"Crear nueva";
                                            return <div className="modal-footer">
                                                <a href="#!" className="modal-action waves-effect waves-green button_design _save _complete" onClick={this.sendToSave}>{word+" tesis"}</a>
                                                <a href="#!" className="modal-action modal-close waves-effect waves-green button_design _cancel">Cerrar</a>
                                            </div>;
                                        }
                                    })()}
                                </li>;
                        }
                    })()}
                </div>

                <div className="button_design waves-effect _cancel modal-trigger" href="#modal_cancel">Cancelar</div>
                <div id="modal_cancel" className="modal">
                    <div className="modal-content">
                        <h4>¿Desea cancelar?</h4>
                    </div>
                    <div className="modal-footer">
                        <a href="/" className="modal-action waves-effect waves-ligth button_design _cancel">Sí</a>
                        <a href="javascript:;" className="modal-action modal-close waves-effect waves-ligth button_design">No</a>
                    </div>
                </div>
            </div>
        )
    }

    getContentModalDetail(){
        let authors  = this.props.dataFormTheses.author.map((el) => {
                                                return <a href="javascript:;" className="collection-item">
                                                    <div className="separator_item_table">
                                                        <li><span>{el.last_name + ", " + el.name}</span></li>
                                                        <li><span>{el.detail}</span></li>
                                                    </div>
                                                </a>
                                            });
        let juries   = this.props.dataFormTheses.jury.map((el) => {
                            return <a href="javascript:;" className="collection-item">
                                <div className="separator_item_table">
                                    <li><span>{el.last_name + ", " + el.name}</span></li>
                                    <li><span>{el.detail}</span></li>
                                </div>
                            </a>
                        });
        let advisers = this.props.dataFormTheses.adviser.map((el) => {
                            return <a href="javascript:;" className="collection-item">{el.last_name + ", " + el.name}</a>
                        });
        return <div className="content_group">
            <div className="group_data">
                <div>
                    <div className="collection with-header">
                        <div className="separator_item_table">
                            <li class="collection-header"><span className="subtitle_detail">{"Autor" + (authors.length > 1 ? "es" : "")}</span></li>
                            <li class="collection-header"><span className="subtitle_detail">Escuela</span></li>
                        </div>
                        {authors}
                    </div>
                </div>
                <div className="collection with-header">
                    <div className="separator_item_table">
                        <li class="collection-header"><span className="subtitle_detail">{"Jurado" + (juries.length > 1 ? "s" : "")}</span></li>
                        <li class="collection-header"><span className="subtitle_detail">Cargo</span></li>
                    </div>
                    {juries}
                </div>
            </div>
            <div className="group_data">
                <div className="collection with-header">
                    <li class="collection-header"><span className="subtitle_detail">{"Asesor" + (advisers.length > 1 ? "es" : "")}</span></li>
                    {(() => {
                        if (advisers.length == "0") {
                            return <a href="javascript:;" className="collection-item no-seleccionable"> --- Sin Asesor ---</a>
                        }
                    })()}
                    {advisers}
                </div>
                <div className="collection with-header date_lift">
                    <li class="collection-header"><span className="subtitle_detail">Código</span></li>
                    <a href="javascript:;" className="collection-item">{this.props.dataFormTheses.code}</a>
                </div>
                <div>
                    <div className="two_collections">
                        <div className="collection with-header date_lift">
                            <li class="collection-header"><span className="subtitle_detail">Publicación</span></li>
                            <a href="javascript:;" className="collection-item">{this.props.dataFormTheses.date_lift}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }

    validateDataForm(currentData) {
        if (!(currentData.title_thesis != "" && currentData.title_thesis != null)) {
            Materialize.toast("¡Falta Título de Tesis!", 4000);
            return false;
        }
        if (!(currentData.code != "" && currentData.code != null)) {
            Materialize.toast("¡Falta Código!", 4000);
            return false;
        }
        if (!(currentData.date_lift != "" && currentData.date_lift != null)) {
            Materialize.toast("¡Falta fecha!", 4000);
            return false;
        }
        let itemsArray = currentData.author;
        if (!this.withContentArray(itemsArray)) {
            Materialize.toast("¡Al menos 1 autor!", 4000);
            return false;
        }
        itemsArray = currentData.jury;
        if (!this.withContentArray(itemsArray)) {
            Materialize.toast("¡Al menos 1 jurado!", 4000);
            return false;
        }
        return true;
    }

    withContentArray(arr) {
        let itemsArray = arr;
        let stArray = false;
        itemsArray.forEach(element => {
            stArray = true;
        });
        return stArray;
    }
}

const mapStateToProps = state => {
    return { dataFormTheses: state.dataFormTheses }
};

export default connect(mapStateToProps)(ItemGroup);
