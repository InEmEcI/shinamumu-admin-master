import Api from "./base/api";

export const SIGN_IN = 'auth/login/'
export const USER_INFO = '/accounts/me'
export const SUBSIDIARIES = '/admin/subsidiaries/'
export const USERS = '/admin/accounts/'
export const SETTINGS = '/admin/settings/'
export const PHOTOS = '/admin/photos/'
export const SCHEDULES = '/admin/work-schedules/'
export const SERVICES = '/admin/services/'
export const CITIES = '/admin/cities/'

class ShinaServiceApi extends Api {
    login(data) {
        return this.http.post(SIGN_IN, data)
    }

    getUserInfo() {
        return this.http.get(USER_INFO)
    }

    getSubsidiaries(params = {}) {
        return this.http.get(SUBSIDIARIES, {
            params: params
        })
    }

    deleteSubsidiary(id) {
        return this.http.delete(SUBSIDIARIES + id + '/')
    }

    getUsers(params = {
        page: 1,
        per_page: 10
    }) {
        return this.http.get(USERS, {
            params: params
        })
    }

    createUser(data) {
        return this.http.post(USERS, data)
    }

    getUser(user_id) {
        return this.http.get(USERS + user_id)
    }

    editUser(user_id, data) {
        return this.http.put(USERS + user_id + '/', data)
    }

    deleteUser(user_id) {
        return this.http.delete(USERS + user_id)
    }

    getSettings(params = {}) {
        return this.http.get(SETTINGS, {
            params: params
        })
    }

    setSettings(data) {
        return this.http.post(SETTINGS, data)
    }

    deleteSettings(id) {
        return this.http.delete(SETTINGS + id)
    }

    getSingleSetting(key) {
        return this.http.get(SETTINGS + key)
    }

    putSingleSetting(key, data) {
        return this.http.put(SETTINGS + key + '/', data)
    }

    getSubsidiary(id) {
        return this.http.get(SUBSIDIARIES + id + '/')
    }

    patchSubsidiary(id, data = {}) {
        return this.http.patch(SUBSIDIARIES + id + '/', data)
    }

    createSubsidiary(data = {}) {
        return this.http.post(SUBSIDIARIES, data)
    }

    uploadSubsidiaryPhoto(data) {
        return this.http.post(PHOTOS, data)
    }

    createSchedules(data) {
        return this.http.post(SCHEDULES, data)
    }

    patchSchedules(id, data) {
        return this.http.patch(SCHEDULES + id + '/', data)
    }

    deleteSchedule(id) {
        return this.http.delete(SCHEDULES + id + '/')
    }

    getServiceById(id) {
        return this.http.get(SERVICES + id + '/')
    }

    patchServiceById(id, data) {
        return this.http.patch(SERVICES + id + '/', data)
    }

    createService(data) {
        return this.http.post(SERVICES, data)
    }

    getCity(data = {}) {
        return this.http.get(CITIES, {
            params: data
        })
    }
}

export default new ShinaServiceApi('/')
