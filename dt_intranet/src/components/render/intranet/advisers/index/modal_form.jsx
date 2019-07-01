import React, { Component } from 'react';
import './../../../../../sass/render/intranet/advisers/index/modal_form.sass'
import {
    Input,Preloader
} from './../../../../lib/react-materialize/form_materialize'
import global from './../../../../../../providers/global.static.jsx'
// import { create } from 'domain';
class ModalForm extends Component{
    constructor(props){
        super(props)
        // this.state = {
        //     name : this.props.author.name||"",
        //     last_name : this.props.author.last_name||"",
        //     type : this.props.type||""
        // }
        this.onChange = this.onChange.bind(this)
        this.onAction = this.onAction.bind(this)
        this.schools = []
    }
    componentDidMount(){
        $(document).ready(()=>{
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $(`#${this.props.id}`).modal();
        });
    }
    componentDidUpdate(){
        // if(this.props.author.id) {
        //     console.log("entro")
        //     $(".modal_autors label").attr("class","active");
        // };
        this.evaluateStated( this.props.adviser.name,$(".modal_advisers #name~label") ) 
        this.evaluateStated( this.props.adviser.last_name,$(".modal_advisers #last_name~label") )
        this.fetchSchools()
        // console.log(this.props.author)
        // console.log(this.props.type)
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            // name : nextProps.author.name||"",
            // last_name : nextProps.author.last_name||"",
            // type : nextProps.type
        }
    }
    fetchSchools(){
        fetch(global.URLBASESERVICE+"/school",{
            method : "POST",
            credentials : "include",
        })
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            if(response){
                this.schools =response
            }
        })
    }
    evaluateStated(input,Jqueryelement){
        input?Jqueryelement.addClass("active"):Jqueryelement.removeClass("active")
    }
    render(){
        return(
            <div id={this.props.id} className="modal modal_advisers">
                    <div className="modal-content">
                        <h4 className="type">
                            {
                                this.props.type==="create"?
                                                    "Añadir Asesor"
                                                    :((this.props.type)==="update"?
                                                        "Editar Asesor"    
                                                    :   "¿Seguro que desea eliminar este Asesor?")
                                                }
                        </h4>
                        <form action="" className="content_inputs" method="POST"
                                onSubmit={this.onAction}>
                                <Input id="last_name"
                                        name="last_name"
                                        type ="text"
                                        label="Apellido(s)"
                                        value={this.props.adviser.last_name||""}
                                        onChange={this.onChange}
                                        className="input_modal" 
                                        disabled={(this.props.type==="delete")}/>
                                <Input id="name"
                                        name="name"
                                        type ="text"
                                        label="Nombre(s)"
                                        value={this.props.adviser.name||""}
                                        onChange={this.onChange}
                                        className="input_modal" 
                                        disabled={(this.props.type==="delete")}/> 
                        </form>
                    </div>
                    <div className="modal-footer" ref = {(ref)=>{this.preloader=ref} }>
                        <a href="javascript:;" 
                                className="modal-action waves-effect  button_design "
                                onClick={this.onAction.bind(this)}>
                                {(this.props.type==="delete")?"Aceptar":"Guardar"}
                        </a>
                        <a href="javascript:;" 
                            className="modal-action modal-close waves-effect waves-red button_design _cancel">Cancelar</a>
                        <Preloader size="small" 
                                color="green" />
                        
                    </div>
            </div>

        );
    }
    onChange(e){
        const key = e.target.name
        const value = e.target.value
        this.props.setAdviserId({
            [key] : value
        })
        
    }
    onAction(e){//  ... create || update || delete
        e.preventDefault()
        console.log("entro")
        let formData = new FormData()
        formData.append("name",this.props.adviser.name.toUpperCase())
        formData.append("last_name", this.props.adviser.last_name.toUpperCase())
        if (this.props.adviser.name&&this.props.adviser.last_name) {
            if(this.props.type!=="create") formData.append("id",this.props.adviser.id)
            $(this.preloader).addClass("show-preloader")
            fetch(global.URLBASESERVICE+`/adviser/${this.props.type}`,{
                credentials : "include",
                method : "POST",
                body: formData
            })
            .then((response)=>{
                console.log(response);
                return response.json();
            })
            .then((response)=>{
                console.log(response);
                if(response){
                    Materialize.toast("Hecho",2000)
                    this.props.resetFetchAdvisers()
                    $(`#${this.props.id}`).modal('close');
                }else{
                    Materialize.toast("Error",2000)
                }
                $(this.preloader).removeClass("show-preloader")
            })
            .catch( reject=>{
                Materialize.toast("El Asesor esta relacionado con una tesis",2000)
                $(this.preloader).removeClass("show-preloader")
            })
        }else{
            Materialize.toast("Complete los campos",2000)
        }
        
    }
    

}


export  default ModalForm
