import React, { Component } from 'react'
import './../../../../../sass/render/intranet/advisers/index/table.sass'
import AdviserRow from './adviser_row'
class Table extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="table advisers">
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
                        this.props.advisers.map((element)=>{
                            return <AdviserRow   element={element}
                                                key={element.id}
                                                setAdviserId= {this.props.setAdviserId}
                                                setModalMode= {this.props.setModalMode}/>
                        })
                    }
                </div>  
            </div>
        );
    }
    
}
export default Table;


