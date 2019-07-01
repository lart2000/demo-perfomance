import React, { Component } from 'react'
import Title from './../../../render/intranet/all/title_def.jsx'
import Filter from '../../../render/intranet/authors/index/filter';
import Pagination from  './../../../render/intranet/all/pagination.jsx'
import ButtonFloating from './../../../render/intranet/authors/index/button_floating.jsx'
import Table from './../../../render/intranet/authors/index/table'
import ModalForm from './../../../render/intranet/authors/index/modal_form'
import './../../../../sass/modules/intranet/authors/index.sass'

import {
    Preloader
} from './../../../lib/react-materialize/form_materialize'

import Header from './../../../render/all/mainHeader'
import Utils from './../../../utils/utils'
import global from './../../../../../providers/global.static.jsx'
class AuthorIndex extends Component{

    constructor(){
        super()
        this.state ={
            search_name   : "",
            search_schools: "",
            author_modal  : {},
            modal_mode    : "create",
            authors       : [],
            pagination    : {
                Page    : 1,
                PerPage : 10,
                Quantity: 0    //no importa al inicio
            }

        }
        this.setModalMode = this.setModalMode.bind(this)
        this.fetchAutors  = this.fetchAutors.bind(this)
        this.changeSearch = this.changeSearch.bind(this)
        this.setAutorId   = this.setAutorId.bind(this)
    }
    componentDidUpdate(prevProps,prevState){
        if(Utils.isDiferent(prevState,this.state)) {
            this.fetchAutors(this.state.pagination.Page)
        }
        this.author_view.classList.remove("show-message")
        setTimeout(() => {
            if(this.state.authors.length===0) this.author_view.classList.add("show-message")
        }, 500);
    }

    fetchAutors(page=1){
        let pagination = this.state.pagination
        const formData = new FormData();
        formData.append("page",page)//pagination.Page
        formData.append("per_page",pagination.PerPage)
        formData.append("quantity",pagination.Quantity)
        formData.append("name",this.state.search_name.trim().replace(/\s/g,"%"))
        formData.append("school_ids",this.state.search_schools.length===0?" ":this.state.search_schools.replace(/, /g,"','"))
        fetch(global.URLBASESERVICE+"/author/index",{
            method     : "POST",
            credentials: "include",
            body       : formData
        })
        .then((response)=>{
            console.log(response);

            return response.json()
        })
        .then((response)=>{
            console.log(response);
            this.setState({
                authors : JSON.parse(response.authors),
                pagination : JSON.parse(response.pagination)
            })
        })
    }
    componentDidMount(){
        this.fetchAutors()
        console.log("entro a index list");

    }
    render(){
        return (

            [
                <Header
                    selected = {1}
                />
                ,<div className="author_view" ref={(ref)=>{this.author_view=ref}}>

                    <Title title="Autores"/>
                    <div className="content">
                        <Filter changeSearch={this.changeSearch}/>
                        {

                            (this.state.authors.length)?
                            <Table setAutorId   = {this.setAutorId}
                                   setModalMode = {this.setModalMode}
                                   authors      = {this.state.authors}/>
                            :
                            <Preloader size  = "normal"
                                       color = "blue"/>
                        }
                        <div className = "content_message">
                            No se encontró resultados
                        </div>
                    </div>
                    <Pagination     pagination     = {this.state.pagination}
                                    fnOnChangePage = {this.fetchAutors}/>
                    <ButtonFloating setModalMode   = {this.setModalMode}
                                    setAutorId     = {this.setAutorId}/>
                    <ModalForm      id             = "modal_author"
                                    type           = {this.state.modal_mode}
                                    author         = {this.state.author_modal}
                                    setAutorId     = {this.setAutorId}
                                    resetFetchAutors = {this.fetchAutors.bind(this)}/>
                </div>
            ]

        );
    }

    setModalMode(mode){
        this.setState({
            modal_mode : mode
        })
    }
    changeSearch(search_name = this.state.search_name,search_schools=this.state.search_name){
        this.setState({
            search_name   : search_name,
            search_schools: search_schools
        })

    }
    setAutorId(author){
        console.log(author)
        this.setState((state,props)=>({
                author_modal : Object.assign(state.author_modal,author)
        }))
    }
}
export default AuthorIndex;
