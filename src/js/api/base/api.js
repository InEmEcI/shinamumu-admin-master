import HttpClient from "./HttpClient";

export default class Api {
    constructor(basePath) {
        if (basePath === undefined) {
            throw new ReferenceError('basePath must not be undefined')
        }
        this.http = new HttpClient(basePath)
    }
}
