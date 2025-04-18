import { ApiClient } from "@ascend/api-client/mrk";
import axios from "axios";

const API_URL_DEV = "http://127.0.0.1:8080";
const API_URL_ALI = "https://zany-carnival-xrv6w67px5xf9p4w-8080.app.github.dev";
const API_URL_PROD = "http://api.ascendx.tech";

export const api = new ApiClient(API_URL_ALI);

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