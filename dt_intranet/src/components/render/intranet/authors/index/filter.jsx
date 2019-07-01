import React, { Component } from 'react'
import Svg_search from './../../../../../icons/svg_search.svg';
import {
    Input
} from './../../../../lib/react-materialize/form_materialize'
import Utils from './../../../../utils/utils'
import global from './../../../../../../providers/global.static.jsx'

class Filter extends Component{

    constructor(props){
        super(props)
        this.state = {
            search_name : "",
            id_school : ""
        }
        this.data_school = []
        this.fetchSchools = this.fetchSchools.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount(){
        this.fetchSchools()
        $(document).ready(()=> {
            $(this.select).material_select();
            $(this.select).parent().children(".select-dropdown").attr("id","input_id_school")
            $(this.select).parent().children("ul#input_id_school").children().click()
            $(this.select).parent().children("ul#input_id_school").click()
            $(this.select).on("change",this.onChange)
            
        });
        
        
    }
    
    fetchSchools(){
        fetch(global.URLBASESERVICE+"/school",{
            method : "POST",
            credentials : "include",
        })
        .then((response)=>{
            // console.log(response);
            return response.json()
        })
        .then((response)=>{
            if(response){
                this.data_school =response
                if(!this.state.id_school.length){
                    // console.log("entro a state")
                    // console.log(this.data_school);
                    this.setState(
                        {
                            id_school : this.data_school.map((element)=>element.name).join(", ")
                        }
                    )
                }
            }
            // console.log(response);
            
        })

    }
    componentDidUpdate(prevProps,prevState){
        // console.log(this.state.id_school);
        if(Utils.isDiferent(prevState,this.state)){
            this.props.changeSearch(this.state.search_name,this.state.id_school)
        }
        
    }
    render(){
        return (
            <div className="content_filter">
                <div className="content_name">
                    <Input id="search"
                            name="search_name"
                            type ="text"
                            label="Nombre o Apellido"
                            value={this.state.search_name}
                            onChange={this.onChange}
                            onFocus={this.toggleSvg.bind(this)}
                            onBlur={this.toggleSvg.bind(this)}
                            className="input_search" />
                    <Svg_search className="svg_search"/>
                </div>
                <div className="content_school">
                    <div class="input-field ">
                        <select id= "id_school"
                                name= "id_school"
                                multiple 
                                value ={this.state.id_school}
                                ref={(ref)=>{this.select=ref}}
                                >
                            {/* <option value="" disabled selected>Choose your option</option> */}
                            {
                                this.data_school.map((element)=>{
                                    return <option value={element.id}>{element.name}</option>
                                })
                            }
                            
                        </select>
                        <label>Escuela(s)</label>
                    </div>
                </div>
            </div>
        );
    }
    onChange(e){
        let key = e.target.name;
        let value = e.target.value;
        this.setState((state,props)=>({
            [key] : key==="id_school"?$("#input_id_school").val():value
        }))
    }
    toggleSvg(){
        document.querySelector(".svg_search").classList.toggle("focus")
    }
}
export default Filter;


