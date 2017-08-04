import React from 'react';
import { hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import Routes from './routes';
import './app.scss';
import { syncHistoryWithStore } from 'react-router-redux';

import 'jquery';
import 'bootstrap/dist/js/bootstrap';

const App = () => {
    const history = syncHistoryWithStore(hashHistory, store);

    return (
        <Provider store={ store }>
            <Routes history={ history } />
        </Provider>
    );
};

export default App;
