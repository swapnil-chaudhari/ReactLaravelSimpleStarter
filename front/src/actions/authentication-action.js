import axios from 'axios';
import {
    FETCH_ACCESS_TOKEN,
} from '../action-types';
import * as auth from '../auth';
import { hashHistory } from 'react-router'

export const apiUrl = 'http://127.0.0.1:8000/';

export const loginData = {
    client_id: '2',
    client_secret: 'jk9cjJ65Mdc4SQi7pHkZcrIczSL0vIqbOlnuFq7K',
    grant_type: 'password',
    username: '',
    password: ''
}

const fetchAccessToken = (loginData) =>
    dispatch =>
        axios.post(`${apiUrl}/oauth/token`, loginData)
        .then((response) => {
            console.log(response);
            auth.setToken(response.data.access_token, response.data.expires_in + Date.now());
            hashHistory.push('/dashboard')
            // dispatch({ type: FETCH_ACCESS_TOKEN, payload: response.data });
        })
        .catch((err) => {
            console.log(err);
        });

export default fetchAccessToken;
