import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';

import AppRoutes from './routes';
import Reducers from './redux/reducers';

import './sass/layouts/general/layout.sass';

render(
    <Provider store={createStore(Reducers)}>
        <Router>
            <AppRoutes />
        </Router>
    </Provider>,
    document.getElementById('app')
)
