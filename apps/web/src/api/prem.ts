import API from "@/api/api";

export async function fetchPlans() {
  const res = await API.get("/payments/subscriptions");
  return res.data;
}
