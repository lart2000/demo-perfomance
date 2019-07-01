import React, { Component } from 'react'
import Title from './../../../render/intranet/all/title_def.jsx'
import Filter from '../../../render/intranet/advisers/index/filter';
import Pagination from  './../../../render/intranet/all/pagination.jsx'
import ButtonFloating from './../../../render/intranet/advisers/index/button_floating.jsx'
import Table from './../../../render/intranet/advisers/index/table'
import ModalForm from './../../../render/intranet/advisers/index/modal_form'
import './../../../../sass/modules/intranet/advisers/index.sass'

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
            adviser_modal  : {},
            modal_mode    : "create",
            advisers       : [],
            pagination    : {
                Page    : 1,
                PerPage : 10,
                Quantity: 0    //no importa al inicio
            }

        }
        this.setModalMode = this.setModalMode.bind(this)
        this.fetchAdvisers  = this.fetchAdvisers.bind(this)
        this.changeSearch = this.changeSearch.bind(this)
        this.setAdviserId   = this.setAdviserId.bind(this)
    }
    componentDidUpdate(prevProps,prevState){
        if(Utils.isDiferent(prevState,this.state)) {
            this.fetchAdvisers(this.state.pagination.Page)
        }
        this.adviser_view.classList.remove("show-message")
        setTimeout(() => {
            if(this.state.advisers.length===0) this.adviser_view.classList.add("show-message")
        }, 500);
    }

    fetchAdvisers(page=1){
        let pagination = this.state.pagination
        const formData = new FormData();
        formData.append("page",page)//pagination.Page
        formData.append("per_page",pagination.PerPage)
        formData.append("quantity",pagination.Quantity)
        formData.append("name",this.state.search_name.trim().replace(/\s/g,"%"))
        // formData.append("school_ids",this.state.search_schools.length===0?" ":this.state.search_schools.replace(/, /g,"','"))
        fetch(global.URLBASESERVICE+"/adviser/index",{
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
                advisers : JSON.parse(response.advisers),
                pagination : JSON.parse(response.pagination)
            })
        })
    }
    componentDidMount(){
        this.fetchAdvisers()
        console.log("entro a index list");

    }
    render(){
        return (

            [
                <Header
                    selected = {3}
                />
                ,<div className="adviser_view" ref={(ref)=>{this.adviser_view=ref}}>

                    <Title title="Asesores"/>
                    <div className="content">
                        <Filter changeSearch={this.changeSearch}/>
                        {

                            (this.state.advisers.length)?
                            <Table setAdviserId   = {this.setAdviserId}
                                   setModalMode = {this.setModalMode}
                                   advisers      = {this.state.advisers}/>
                            :
                            <Preloader size  = "normal"
                                       color = "blue"/>
                        }
                        <div className = "content_message">
                            No se encontró resultados
                        </div>
                    </div>
                    <Pagination     pagination     = {this.state.pagination}
                                    fnOnChangePage = {this.fetchAdvisers}/>
                    <ButtonFloating setModalMode   = {this.setModalMode}
                                    setAdviserId     = {this.setAdviserId}/>
                    <ModalForm      id             = "modal_adviser"
                                    type           = {this.state.modal_mode}
                                    adviser         = {this.state.adviser_modal}
                                    setAdviserId     = {this.setAdviserId}
                                    resetFetchAdvisers = {this.fetchAdvisers}/>
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
    setAdviserId(adviser){
        console.log(adviser)
        this.setState((state,props)=>({
                adviser_modal : Object.assign(state.adviser_modal,adviser)
        }))
    }
}
export default JuriesIndex;
