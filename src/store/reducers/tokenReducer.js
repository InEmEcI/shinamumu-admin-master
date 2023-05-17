import initialState from "./initialState";
import Cookies from 'js-cookie'

export default function tokenReducer(state = initialState.token, action) {
    switch (action.type) {
        case "SET_TOKEN": {
            Cookies.set('shina_admin_token', action.payload);
            return action.payload
        }
        case "REMOVE_TOKEN": {
            Cookies.remove('shina_admin_token');
            return null

        }
        default:
            return state
    }
}
