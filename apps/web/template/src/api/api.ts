import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3005", // or your deployed API URL
});

// Replace with your real token logic
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0NDgzNTQ3LCJleHAiOjE3NDQ1MjY3NDd9.bJLtX_NZkNBcnC1u1Na3dkdIxeVam6ZRwEkTIa17xRM";

// ✅ Type-safe interceptor
API.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  // Set Authorization header safely
  (config.headers as any)["Authorization"] = `Bearer ${token}`;

  return config;
});

export default API;
