import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ascendx.tech/post",
});

API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default API;
