import initialState from './initialState'

export default function userReducer(state = initialState.user, action) {
    switch (action.type) {
        case 'UPDATE_USER': {
            return {
                ...state,
                user: {...action.payload}
            }
        }
        default:
            return state
    }
}
