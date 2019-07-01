import React, { Component } from 'react'
import './../../../../../sass/render/intranet/juries/index/table.sass'
import JuryRow from './jury_row'
class Table extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="table juries">
                <div className="t_head">
                    <div className="t_head_row">
                        <span className="t_head_item">
                            Apellido
                        </span>
                        <span className="t_head_item">
                            Nombre
                        </span>
                        <span className="t_head_item">
                            Opciones
                        </span>
                    </div>
                </div>
                <div className="t_body">
                    {
                        this.props.juries.map((element)=>{
                            return <JuryRow   element={element}
                                                key={element.id}
                                                setJuryId= {this.props.setJuryId}
                                                setModalMode= {this.props.setModalMode}/>
                        })
                    }
                </div>  
            </div>
        );
    }
    
}
export default Table;


