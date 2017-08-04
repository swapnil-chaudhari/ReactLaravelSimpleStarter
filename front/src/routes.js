import React, { PropTypes } from 'react';
import { Router, Route } from 'react-router';
import Login from './components/authentication/Login';
import Dashboard from './components/dashboard/Dashboard';

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
        </Route>
    </Router>
);

Routes.propTypes = {
    history: PropTypes.object
};

export default Routes;
