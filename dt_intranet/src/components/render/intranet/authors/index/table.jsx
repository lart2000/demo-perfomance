import React, { Component } from 'react'
import './../../../../../sass/render/intranet/authors/index/table.sass'
import AuthorRow from './author_row'
class Table extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="table authors">
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
                        this.props.authors.map((element)=>{
                            return <AuthorRow   element={element}
                                                key={element.id}
                                                setAutorId= {this.props.setAutorId}
                                                setModalMode= {this.props.setModalMode}/>
                        })
                    }
                </div>  
            </div>
        );
    }
    
}
export default Table;


