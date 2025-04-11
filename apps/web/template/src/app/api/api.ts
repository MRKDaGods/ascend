// apps/web/template/src/app/api/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3005",
});

// Optional: Replace this with your actual logic for getting the token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0Mjk3MDkwOSwiZXhwIjoxNzQyOTc0NTA5fQ.rWr8KyRXn0wAAmuMm0qQ5tPpjtm8kw0DoqGclckM_1E";

API.interceptors.request.use((config) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0Mjk3MDkwOSwiZXhwIjoxNzQyOTc0NTA5fQ.rWr8KyRXn0wAAmuMm0qQ5tPpjtm8kw0DoqGclckM_1E";
  
    // Ensure headers exist before modifying
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
  
    return config;
  });

export default API;
