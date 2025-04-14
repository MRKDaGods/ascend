import axios from "axios";

const API = axios.create({
  baseURL: "http://api.ascendx.tech/post",
});

// Static token for now 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0NjU2NjY2LCJleHAiOjE3NDQ2OTk4NjZ9.MUss-3OVisxAgxfZveo0PVthmN5ZFVRQg-SK7uc6QXE";

API.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export default API;
