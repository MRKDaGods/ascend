import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ascendx.tech/post",
});

// Static token for now
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1MDA2NTg1LCJleHAiOjE3NDUwNDk3ODV9.6zEhcz4xNKx86hFGYj-1ruFvSJpYtCE-JVz5dLx5LPo";

API.interceptors.request.use((config) => {
  // Ensure headers is an instance of AxiosHeaders
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default API;