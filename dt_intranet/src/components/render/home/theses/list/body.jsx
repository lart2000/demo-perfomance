import React, { Component } from 'react';

import global from '../../../../../../providers/global.static.jsx';

import FormList from './filter.jsx';
import Pagination from '../../../../render/intranet/all/pagination';

class Body extends Component {
    constructor(props) {
        super(props);
        this.onFilterTheses = this.onFilterTheses.bind(this);
        this.onErrorService = this.onErrorService.bind(this);
        this.state = {
            list_theses: null,
            st_query   : null,   // null -> cargando | false -> error | true -> correcto
            currentId  : ""
        };

        this.listDataOpen = [];

        this.title    = "";
        this.schools  = [];
        this.advisers = [];
        this.authors  = [];
        this.juries   = [];
        this.id = "";

        this.page = 1;
        this.per_page = 10;
    }

    fetchListTheses() {
        let data = new FormData();
        data.append("page", this.page);
        data.append("per_page", this.per_page);

        data.append("title_filter", this.title);
        data.append("authors", this.authors);
        data.append("advisers", this.advisers);
        data.append("juries", this.juries);
        data.append("schools", this.schools);

        fetch(global.URLBASESERVICE + "/tesis", {
            method: 'POST',
            credentials: "include",
            body: data
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            let thesis     = JSON.parse(rpta.thesis);
            let pagination = JSON.parse(rpta.pagination);
            this.setState({ list_theses: thesis,
                            pagination: pagination});
            if (rpta == false){
                this.setState({
                    list_theses: null,
                    pagination: null,
                    st_query: false
                });
            }else{
                let thesis = JSON.parse(rpta.thesis);
                let pagination = JSON.parse(rpta.pagination);
                this.setState({ list_theses: thesis,
                                pagination: pagination,
                                st_query: true});
            }
        }).catch(()=>{
            this.onErrorService();
        });
    }

    onErrorService(){
        this.setState({
            list_theses: null,
            pagination: null,
            st_query: false
        });
    }

    onFilterTheses(data){
        this.title    = data.title;
        this.schools  = data.schools;
        this.authors  = data.authors;
        this.advisers = data.advisers;
        this.juries   = data.juries;
        this.fetchListTheses();
    }

    render() {
        let pagination = this.state.pagination;
        return (
            <div className="body_view_list_thesis">
                <FormList onFilter={this.onFilterTheses} onErrorService={this.onErrorService}/>
                <div className="table_design">
                    <div className="txt_total">{"Total: " + (!pagination ? 0 : pagination.Quantity)}</div>
                    <div className="headboard distribution">
                        <div className="order_number"><span>N°</span></div>
                        <div className="title_item"><span>Título de Tesis</span></div>
                    </div>
                    <ul className="collapsible body_table_design popout" data-collapsible="accordion">
                        {
                            (()=>{
                                let items = [];
                                let allData = this.state.list_theses;
                                let stQuery = this.state.st_query;
                                if (stQuery == null){
                                    items.push(this.getPreloader(true));
                                } else if (stQuery == false){
                                    items.push(this.getHtmlMessage('0'));
                                } else if (allData.length == 0){
                                    items.push(this.getHtmlMessage('1'));
                                }else{
                                    allData.forEach((element, key) => {
                                        items.push(this.getHtmlItemThesis(element, key));
                                    });
                                }
                                return items;
                            })()
                        }
                    </ul>
                </div>

            <Pagination fnOnChangePage={this.selectedPage.bind(this)} pagination={this.state.pagination} />
        </div>
        )
    }

    getPreloader(isBig){
        let itemClass = isBig ? "" :"preloader_item";
        let size      = isBig ? "big": "medium";
        return <div className={"content_preloader " + itemClass}>
            <div className={"preloader-wrapper active "+ size}>
                <div className="spinner-layer">
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
    }

    getDataPerThesis(item){
        let dateLift = this.formatDate(item.date_lift);
        let data = new FormData();
        data.append("id", item.id);
        fetch(global.URLBASESERVICE + "/tesis/all_data", {
            method: 'POST',
            credentials: "include",
            body: data
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            let obj = {
                authors  : JSON.parse(rpta.authors),
                advisers : JSON.parse(rpta.advisers),
                juries   : JSON.parse(rpta.juries),
                school   : item.school,
                dateLift
            };
            let id = item.id;
            this.listDataOpen[id] = obj;
            this.setState({ currentId: id });
        });
    }

    getHtmlItemThesis(element,key){
        let currentPage = this.page;
        let perPage     = this.per_page;
        let dataSaved   = this.listDataOpen[element.id];

        return <li key={key} onClick={() => { !dataSaved ? this.getDataPerThesis(element):""}}>
            <div class="collapsible-header distribution">
                <div class="order_number">
                    <span>{perPage * (currentPage - 1) + key + 1}</span>
                </div>
                <div class="title_item">
                    <span>{element.name}</span>
                </div>
            </div>
            <div class="collapsible-body">
                {
                    (()=>{
                        if (!dataSaved) {
                            return this.getPreloader(false);
                        }else{
                            let authors  = dataSaved.authors.map((el, key) => {
                                                return <a href="javascript:;" className="collection-item">
                                                    <div className="separator_item_table">
                                                        <li><span>{el.last_name + ", " + el.name}</span></li>
                                                        <li><span>{el.school}</span></li>
                                                    </div>
                                                </a>
                                            });
                            let juries   = dataSaved.juries.map((el, key) => {
                                                return <a href="javascript:;" className="collection-item">
                                                    <div className="separator_item_table">
                                                        <li><span>{el.last_name + ", " + el.name}</span></li>
                                                        <li><span>{el.charge}</span></li>
                                                    </div>
                                                </a>
                                            });
                            let advisers = dataSaved.advisers.map((el, key) => {
                                                return <a href="javascript:;" className="collection-item">{el.last_name + ", " + el.name}</a>
                                            });
                            return <div className="content_group">
                                <div className="group_data">
                                    <div>
                                        <div className="collection with-header">
                                            <div className="separator_item_table">
                                                <li class="collection-header"><span className="subtitle_detail">{"Autor"+(authors.length > 1 ? "es": "")}</span></li>
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
                                        {(()=>{
                                            if(advisers.length == "0"){
                                                return <a href="javascript:;" className="collection-item no-seleccionable"> --- Sin Asesor ---</a>
                                            }
                                        })()}
                                        {advisers}
                                    </div>
                                    <div className="collection with-header date_lift">
                                        <li class="collection-header"><span className="subtitle_detail">Código</span></li>
                                        <a href="javascript:;" className="collection-item">{element.code}</a>
                                    </div>
                                    <div>
                                        <div className="two_collections">
                                            <div className="collection with-header date_lift">
                                                <li class="collection-header"><span className="subtitle_detail">Publicación</span></li>
                                                <a href="javascript:;" className="collection-item">{dataSaved.dateLift}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>;
                        }
                    })()
                }
            </div>
        </li>;
    }

    getCollectionWithHeader(data,typeName,plural){
        return <div className="collection with-header">
            <li class="collection-header"><span className="subtitle_detail">{typeName + (data.length > 1 ? plural : "")}</span></li>
            {(() => {
                if (data.length == "0") {
                    return <a href="javascript:;" className="collection-item">{" --- Sin " + typeName + " ---"}</a>
                }
            })()}
            {data}
        </div>;
    }

    getHtmlMessage(type){
        let msn = "Ha ocurrido un error con su servicio.";
        if(type == '1'){
            msn = "No hay tesis registradas.";
        }
        return <div className="message"><span>{msn}</span></div>;
    }

    selectedPage(page) {
        this.page = page;
        this.fetchListTheses();
    }

    onAcceptDelete() {
        this.page = 1;
        this.fetchListTheses();
    }

    formatDate(date){
        let newDate = date.substring(0, 10);
        let arr = newDate.split("-");
        newDate = arr[2] + "/" + arr[1] + "/" + arr[0];
        return newDate;
    }

}
export default Body;
