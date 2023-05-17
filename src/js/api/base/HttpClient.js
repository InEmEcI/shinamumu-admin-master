import axios from "axios";
import Cookies from "js-cookie";

export default function $Htttp(basePath = '') {
    const settings = {
        baseURL: 'https://shinomumu-backend-develop.netstack.ru' + basePath,
        withCredentials: true
    }

    this.axiosInstance = axios.create(settings)

    this.axiosInstance.interceptors.request.use(config => {
        const token = Cookies.get('shina_admin_token')
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });
    this.axiosInstance.interceptors.response.use(response => {
        // Do something with response data
        return response;
    }, error => {
        /*  if (error.response.status === 401 && !error.config._retry) {
            error.config._retry = true;
            store.dispatch(LOGOUT)

            if (location.pathname !== '/login')
              router.push({
                name: '401'
              });
            return;
          }*/
        return Promise.reject(error.response ? error.response : error);
    });

    return this.axiosInstance
}
