import React, { Component } from 'react';

import Header from '../../../render/all/mainHeader.jsx';

import Body from '../../../render/home/theses/list/body.jsx';

import '../../../../sass/modules/home/theses/list.sass';

class theses extends Component {
    render() {
        return (
            <div className="view_list_thesis_home">
                <Header/>
                <Body/>
            </div>
        );
    }
}

export default theses;
