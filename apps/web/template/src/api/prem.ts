// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend.com", // replace with real API base URL
  withCredentials: true, // if using cookies for auth
});

// Optional: Add Authorization header (if using token)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchPlans() {
  const token = "your-auth-token"; // Replace with the actual token logic if needed

  const res = await fetch("/payments/subscriptions", {
    headers: {
      Authorization: `Bearer ${token}`, // Add the Authorization header
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch plans");
  }

  return res.json();
}

export default api;
