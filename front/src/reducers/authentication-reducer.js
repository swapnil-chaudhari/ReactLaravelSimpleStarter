import {
    FETCH_ACCESS_TOKEN,
} from '../action-types';

export default function reducer(state = {
    tokenDetails: {},

}, action) {
    switch (action.type) {
        case FETCH_ACCESS_TOKEN: {
            return { ...state, tokenDetails: action.payload };
        }
        default : {
            return state;
        }
    }

}
