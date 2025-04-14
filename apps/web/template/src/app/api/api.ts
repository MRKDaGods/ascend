import axios from "axios";

const API = axios.create({
  baseURL: "http://api.ascendx.tech/post",
});

// Static token for now (can be replaced with dynamic logic later)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0NDg4NDkzLCJleHAiOjE3NDQ1MzE2OTN9.CSXbCy_lkTrEl4IDzjBPM-GFPvmRpOakQEigkqZ8vZY";

API.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export default API;
