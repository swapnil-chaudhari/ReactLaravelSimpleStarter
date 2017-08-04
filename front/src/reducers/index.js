import { combineReducers } from 'redux';
import authentication from './authentication-reducer';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    routing: routerReducer,
    authentication,
});
