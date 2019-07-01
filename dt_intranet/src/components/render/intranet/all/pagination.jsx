import React, { Component } from 'react';

class Pagination extends Component {
    constructor(props) {
        super(props);
    }

    onClickPage(page){
        if (this.props.pagination != page){
            this.props.fnOnChangePage(page);
        }
    }

    // this.props.pagination es el parámetro que llega
    // desde el compomente donde se llamó.
    // la data entrante por ese parámetro mantiene ya
    // una estructura para que sea reutilizable
    // ver estructura en buffalo
    render() {
        return (
            <ul className="pagination">
                {
                    (() => {
                        let currentProps = this.props;
                        if (!!currentProps.pagination) {
                            let quantity = currentProps.pagination.Quantity;
                            let per_page = currentProps.pagination.PerPage;
                            let excedent = quantity % per_page > 0 ? 1 : 0;
                            let numberPages = ((quantity / per_page) | 0) + excedent;
                            let elements = [];

                            if (numberPages != 1) {
                                let page = currentProps.pagination.Page;
                                let limitMaxPage = page + 3;
                                let limitMinPage = page - 3;
                                for (let i = limitMinPage; i <= limitMaxPage; i++) {
                                    if (i > 0 && i <= numberPages) {
                                        let isActive = (i == page) ? 'active' : '';
                                        isActive += " waves-effect";
                                        elements.push(<li className={isActive} key={i}>
                                            <a href={"#"+i} onClick={() => { this.onClickPage(i) }}>{i}</a>
                                        </li>);
                                    }
                                }
                            }
                            return elements;
                        }
                    })()
                }
            </ul>
        );
    }
}

export default Pagination;
