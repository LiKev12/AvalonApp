import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

const initialState = {
    token: sessionStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
};

// eslint-disable-next-line
export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user
            };

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            console.log('[action payload]', action.payload);
            sessionStorage.setItem('token', action.payload.token);
            sessionStorage.setItem('user_name', action.payload.user.name);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };

        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_name');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };

        default:
            return state;
    }
}
