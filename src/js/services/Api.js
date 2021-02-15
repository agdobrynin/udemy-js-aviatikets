import axios from "axios";

export default class Api {

    constructor(config) {
        this.endpoint = config.endpoint;
    }

    async countries() {
        try {
            const response = await axios.get(`${this.endpoint}/countries`);

            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async cities() {
        try {
            const response = await axios.get(`${this.endpoint}/cities`);

            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async airlines() {
        try {
            const response = await axios.get(`${this.endpoint}/airlines`);

            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async prices(params) {
        try {
            const response = await axios.get(`${this.endpoint}/prices/cheap`, {
                params,
            });

            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

}
