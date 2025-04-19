// hooks/useSubscription.ts
import { useEffect, useState } from "react";
import { fetchPlans } from "@/lib/api";

export function useSubscription<T>() {
  const [plans, setPlans] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      const token = localStorage.getItem("authToken");
      try {
        const data = await fetchPlans();
        console.log("Response:", data);
        setPlans(data);
      } catch (err) {
        setError("Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  return { plans, loading, error };
}
