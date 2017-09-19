import React, { PropTypes } from 'react';
import { Router, Route } from 'react-router';

import Login from './components/authentication/Login';
import Dashboard from './components/dashboard/Dashboard';
import Tour from './containers/tour/tour';

const Routes = ({ history }) => (
    <Router history={ history }>
        <Route>
            <Route
                path="/"
                component={ Login }
            />
            <Route
                path="login"
                component={ Login }
            />
            <Route
                path="dashboard"
                component={ Dashboard }
            />
            <Route
                path="tour"
                component={ Tour }
            />
        </Route>
    </Router>
);

Routes.propTypes = {
    history: PropTypes.object
};

export default Routes;
