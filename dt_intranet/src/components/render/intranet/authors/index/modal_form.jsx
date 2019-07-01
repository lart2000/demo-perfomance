import React, { Component } from 'react';
import './../../../../../sass/render/intranet/authors/index/modal_form.sass'
import {
    Input,Select,Preloader
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
        this.evaluateStated( this.props.author.name,$(".modal_autors #name~label") ) 
        this.evaluateStated( this.props.author.last_name,$(".modal_autors #last_name~label") )
        this.evaluateStated( this.props.author.school_id,$(".modal_autors .select-wrapper~label") )
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
            <div id={this.props.id} className="modal modal_autors">
                    <div className="modal-content">
                        <h4 className="type">
                            {
                                this.props.type==="create"?
                                                    "Añadir Autor"
                                                    :((this.props.type)==="update"?
                                                        "Editar Autor"    
                                                    :   "¿Seguro que desea eliminar este Autor?")
                                                }
                        </h4>
                        <form action="" className="content_inputs"
                                onSubmit={this.onAction}>
                                <Input id="last_name"
                                        name="last_name"
                                        type ="text"
                                        label="Apellido(s)"
                                        value={this.props.author.last_name||""}
                                        onChange={this.onChange}
                                        className="input_modal" 
                                        disabled={(this.props.type==="delete")}/>
                                <Input id="name"
                                        name="name"
                                        type ="text"
                                        label="Nombre(s)"
                                        value={this.props.author.name||""}
                                        onChange={this.onChange}
                                        className="input_modal" 
                                        disabled={(this.props.type==="delete")}/>
                                <Select id="school_id" 
                                        name="school_id" 
                                        value={this.props.author.school_id||""} 
                                        onChange={this.onChange}
                                        label = "Escuela"
                                        disabled = {this.props.type ==="delete"}
                                        options={[
                                            ...(()=>this.schools.map((element)=>(
                                                        {
                                                            text: element.name,
                                                            value: element.id,
                                                            key: element.id,
                                                            
                                                        }
                                                    ))
                                                )()
                                        ]}  />
                        </form>
                        {/* <div className="content_inputs">
                            
                        </div> */}
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
        this.props.setAutorId({
            [key] : value
        })
        
    }
    onAction(e){//  ... create || update || delete
        e.preventDefault()
        console.log("entro")
        let formData = new FormData()
        formData.append("name",this.props.author.name)
        formData.append("last_name", this.props.author.last_name)
        formData.append("school_id", this.props.author.school_id)
        if (this.props.author.name&&this.props.author.last_name&&this.props.author.school_id) {
            if(this.props.type!=="create") formData.append("id", this.props.author.id)
            $(this.preloader).addClass("show-preloader")
            fetch(global.URLBASESERVICE+`/author/${this.props.type}`,{
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
                    this.props.resetFetchAutors()
                    $(`#${this.props.id}`).modal('close');
                }else{
                    Materialize.toast("Error",2000)
                }
                $(this.preloader).removeClass("show-preloader")
            })
            .catch( reject=>{
                Materialize.toast("El Autor esta relacionado con una tesis",2000)
                $(this.preloader).removeClass("show-preloader")
            })
        }else{
            Materialize.toast("Complete los campos",2000)
        }
        
    }
    

}


export  default ModalForm
