import React, { Component } from 'react';

import Header from '../../../render/all/mainHeader.jsx';
import Body from '../../../render/intranet/theses/list/body.jsx';

import '../../../../sass/modules/intranet/theses/list.sass';

class theses extends Component {
    render() {
        return (
            <div className="view_list_thesis">
                <Header selected={0}/>
                <Body/>
            </div>
        );
    }
}

export default theses;
