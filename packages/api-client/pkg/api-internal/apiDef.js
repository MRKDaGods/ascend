import { ApiClient } from "../mrk";

const API_URL_DEV = "http://127.0.0.1:8080";
const API_URL_PROD = "http://api.ascendx.tech";

export const api = new ApiClient(API_URL_DEV);
