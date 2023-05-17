export const setUser = (payload) => {
    return {
        type: 'UPDATE_USER',
        payload: payload
    }
}

export const setToken = (token) => {
    return {
        type: 'SET_TOKEN',
        payload: token
    }
}
