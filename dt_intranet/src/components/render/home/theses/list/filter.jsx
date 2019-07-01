import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import IconInfo from '../../../../../icons/svg_info.svg';

import Utils from "../../../../utils/utils.jsx";
import global from '../../../../../../providers/global.static.jsx';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            schoolsList : []
        };
        this.title       = "";
        this.arrAuthors  = [];
        this.arrAdvisers = [];
        this.arrJuries   = [];
    }

    componentDidMount() {
        this.fetchGetSchools();
    }

    fetchGetSchools(){
        fetch(global.URLBASESERVICE + "/school", {
            method: 'POST',
            credentials: "include"
        })
        .then((response) => {
            return response.json();
        })
        .then((rpta) => {
            this.setState({ schoolsList: rpta});
            $('select').material_select();
            $('.chips').material_chip();
            this.onSearch();
            this.enabledEventsChips();
            this.enabledEventSelect();
        }).catch(() => {
            this.props.onErrorService();
        });
    }

    enabledEventSelect(){
        $('select').on("change", (e) => {
            this.onSearch();
        });
    }

    enabledEventsChips(){
        $('.chips').on("chip.add", (e, chip) => {
            let word = chip.tag;
            if (e.currentTarget.id == "authors_chips"){
                this.arrAuthors.push(word);
            } else if (e.currentTarget.id == "advisers_chips"){
                this.arrAdvisers.push(word);
            }else{
                this.arrJuries.push(word);
            }
            this.onSearch();
        });
        $('.chips').on("chip.delete", (e, chip) => {
            let word = chip.tag;
            if (e.currentTarget.id == "advisers_chips") {
                let newArr = this.arrAdvisers.filter((el,key)=>{
                    if (el != word){
                        return el
                    }
                });
                this.arrAdvisers = newArr;
            } else if (e.currentTarget.id == "authors_chips"){
                let newArr = this.arrAuthors.filter((el, key) => {
                    if (el != word) {
                        return el
                    }
                });
                this.arrAuthors = newArr;
            }else{
                let newArr = this.arrJuries.filter((el, key) => {
                    if (el != word) {
                        return el
                    }
                });
                this.arrJuries = newArr;
            }
            this.onSearch();
        });
    }

    onEnterDetected(e) {
        if (e.keyCode === 13){
            let values = e.target.value;
            if(this.title != values.trim()){
                this.title   = values.trim();
                this.onSearch();
            }
        }
    }

    onSearch(){
        let newTitle = this.utils.clearExcessiveSpaces(this.title);;
        newTitle = this.utils.removeAccents(newTitle);
        if (newTitle.length > 5){
            let arrTxt = newTitle.split(" ");
            newTitle = this.utils.clearArticlesString(arrTxt);
        }

        let dataFilter = {
            title    : newTitle,
            authors  : this.clearElementsArray(this.arrAuthors),
            advisers : this.clearElementsArray(this.arrAdvisers),
            juries   : this.clearElementsArray(this.arrJuries),
            schools  : $(".form_filter .input-field select").val(),
        }
        this.props.onFilter(dataFilter);
    }

    clearElementsArray(arrayList){
        return arrayList.map((el, i)=>{
            el = this.utils.clearExcessiveSpaces(el);
            return this.utils.removeAccents(el)
        });
    }

    render() {
        return (
            <div class="form_filter">
                <div class="input-field inp_thesis">
                    <input id="thesis" type="text" onKeyUp={(e) => { this.onEnterDetected(e) }} />
                    <label for="thesis">Nombre de Tesis</label>
                </div>
                <div className="content_inp_field">
                    <div class="input-field">
                        <div class="chips authors" id="authors_chips"></div>
                        <label for="authors_chips">Autores</label>
                    </div>
                    <div class="input-field">
                        <div class="chips advisers" id="advisers_chips"></div>
                        <label for="advisers_chips">Asesores</label>
                    </div>
                    <div class="input-field">
                        <div class="chips juries" id="juries_chips"></div>
                        <label for="juries_chips">Jurados</label>
                    </div>
                </div>
                <div class="input-field inp_short">
                    <select multiple>
                        {(() => {
                            let schools = this.state.schoolsList;
                            return schools.map((data, key) => {
                                return <option value={data.id} id={key} selected>{data.name}</option>;
                            });
                        })()}
                    </select>
                    <label>Escuelas</label>
                </div>
            </div>
        )
    }
}

export default Filter;
