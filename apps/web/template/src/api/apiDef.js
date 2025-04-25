import { ApiClient } from "@ascend/api-client/mrk";
import axios from "axios";

const API_URL_PROD = "https://api.ascendx.tech";

export const api = new ApiClient(API_URL_PROD);

export const extApi = axios.create({
    baseURL: api.baseUrl
});

extApi.interceptors.request.use((config) => {
    try {
        const token = api.auth.authToken;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    catch (e) {
        // no auth token set
    }
    
    return config;
});