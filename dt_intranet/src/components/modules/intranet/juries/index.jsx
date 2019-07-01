import React, { Component } from 'react'
import Title from './../../../render/intranet/all/title_def.jsx'
import Filter from '../../../render/intranet/juries/index/filter';
import Pagination from  './../../../render/intranet/all/pagination.jsx'
import ButtonFloating from './../../../render/intranet/juries/index/button_floating.jsx'
import Table from './../../../render/intranet/juries/index/table'
import ModalForm from './../../../render/intranet/juries/index/modal_form'
import './../../../../sass/modules/intranet/juries/index.sass'

import {
    Preloader
} from './../../../lib/react-materialize/form_materialize'

import Header from './../../../render/all/mainHeader'
import Utils from './../../../utils/utils'
import global from './../../../../../providers/global.static.jsx'
class JuriesIndex extends Component{

    constructor(){
        super()
        this.state ={
            search_name   : "",
            search_schools: "",
            jury_modal  : {},
            modal_mode    : "create",
            juries       : [],
            pagination    : {
                Page    : 1,
                PerPage : 10,
                Quantity: 0    //no importa al inicio
            }

        }
        this.setModalMode = this.setModalMode.bind(this)
        this.fetchJuries  = this.fetchJuries.bind(this)
        this.changeSearch = this.changeSearch.bind(this)
        this.setJuryId   = this.setJuryId.bind(this)
    }
    componentDidUpdate(prevProps,prevState){
        if(Utils.isDiferent(prevState,this.state)) {
            this.fetchJuries(this.state.pagination.Page)
        }
        this.jury_view.classList.remove("show-message")
        setTimeout(() => {
            if(this.state.juries.length===0) this.jury_view.classList.add("show-message")
        }, 500);
    }

    fetchJuries(page=1){
        let pagination = this.state.pagination
        const formData = new FormData();
        formData.append("page",page)//pagination.Page
        formData.append("per_page",pagination.PerPage)
        formData.append("quantity",pagination.Quantity)
        formData.append("name",this.state.search_name.trim().replace(/\s/g,"%"))
        // formData.append("school_ids",this.state.search_schools.length===0?" ":this.state.search_schools.replace(/, /g,"','"))
        fetch(global.URLBASESERVICE+"/jury/index",{
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
                juries : JSON.parse(response.juries),
                pagination : JSON.parse(response.pagination)
            })
        })
    }
    componentDidMount(){
        this.fetchJuries()
        console.log("entro a index list");

    }
    render(){
        return (

            [
                <Header
                    selected = {2}
                />
                ,<div className="jury_view" ref={(ref)=>{this.jury_view=ref}}>

                    <Title title="Jurados"/>
                    <div className="content">
                        <Filter changeSearch={this.changeSearch}/>
                        {

                            (this.state.juries.length)?
                            <Table setJuryId   = {this.setJuryId}
                                   setModalMode = {this.setModalMode}
                                   juries      = {this.state.juries}/>
                            :
                            <Preloader size  = "normal"
                                       color = "blue"/>
                        }
                        <div className = "content_message">
                            No se encontró resultados
                        </div>
                    </div>
                    <Pagination     pagination     = {this.state.pagination}
                                    fnOnChangePage = {this.fetchJuries}/>
                    <ButtonFloating setModalMode   = {this.setModalMode}
                                    setJuryId     = {this.setJuryId}/>
                    <ModalForm      id             = "modal_jury"
                                    type           = {this.state.modal_mode}
                                    jury         = {this.state.jury_modal}
                                    setJuryId     = {this.setJuryId}
                                    resetFetchJuries = {this.fetchJuries}/>
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
    setJuryId(jury){
        console.log(jury)
        this.setState((state,props)=>({
                jury_modal : Object.assign(state.jury_modal,jury)
        }))
    }
}
export default JuriesIndex;
