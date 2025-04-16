import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ascendx.tech/post",
});

// Static token for now
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0Nzc3OTgzLCJleHAiOjE3NDQ4MjExODN9.J-0Fzn4HqkMbXErF03XQGh7gHw3VrlCdcU2BO57f-7A";

API.interceptors.request.use((config) => {
  // Ensure headers is an instance of AxiosHeaders
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default API;
