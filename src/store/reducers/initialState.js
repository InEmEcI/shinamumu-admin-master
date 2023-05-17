import Cookies from 'js-cookie'
const initialState = {
    user: {},
    token: Cookies.get('shina_admin_token') || null
}

export default initialState;
