import axios from 'axios';
import { GET_ROOM_IDS, ADD_ROOM_ID } from './types';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

export const getRooms = () => dispatch => {
    axios
        .get('/api/rooms')
        .then(res =>
            dispatch({
                type: GET_ROOM_IDS,
                payload: res.data
            })
        )
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addRoomWithoutDispatch = room_data => (dispatch, getState) => {
    axios.post('/api/rooms', room_data, tokenConfig(getState));
    // .then(res => console.log('res', res))
    // .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
