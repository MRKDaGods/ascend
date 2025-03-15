import { create } from "zustand";
import { useEffect, useState } from "react";


// ✅ Zustand Store for Theme Management
export const useThemeStore = create<{
  theme: "light" | "dark";
  toggleTheme: () => void;
}>((set) => ({
  theme: "dark", // Default to dark mode
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export const useClientTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Default to dark mode
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme, isClient };
};
