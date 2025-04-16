import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ascendx.tech/post",
});

// Static token for now
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0NjU2NjY2LCJleHAiOjE3NDQ2OTk4NjZ9.MUss-3OVisxAgxfZveo0PVthmN5ZFVRQg-SK7uc6QXE";

API.interceptors.request.use((config) => {
  // Ensure headers is an instance of AxiosHeaders
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default API;
