import { ApiClient } from "@ascend/api-client/mrk";

const API_URL_DEV = "http://127.0.0.1:8080";
const API_URL_PROD = "http://16.171.3.50";


export const api = new ApiClient(API_URL_PROD);
