import axios from "axios";

const API = axios.create({
  baseURL: "https://api.ascendx.tech/post",
});

// Automatically attach the token using AxiosHeaders-compatible syntax
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else if (config.headers) {
      // 🔁 Patch for cases where headers is a plain object (older Axios)
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;
