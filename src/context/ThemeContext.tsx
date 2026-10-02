"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("tgs-theme") as Theme | null;
    const initialTheme = savedTheme || "light";
    setThemeState(initialTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
    if (initialTheme === "light") {
      document.documentElement.style.backgroundColor = "#F4F5F8";
      document.documentElement.style.color = "#0F172A";
    } else {
      document.documentElement.style.backgroundColor = "#0B0C10";
      document.documentElement.style.color = "#F8FAFC";
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("tgs-theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    if (newTheme === "light") {
      document.documentElement.style.backgroundColor = "#F4F5F8";
      document.documentElement.style.color = "#0F172A";
    } else {
      document.documentElement.style.backgroundColor = "#0B0C10";
      document.documentElement.style.color = "#F8FAFC";
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const d = document.documentElement;
    d.classList.add("theme-transitioning");
    setTheme(nextTheme);

    setTimeout(() => {
      d.classList.remove("theme-transitioning");
    }, 450);
  };

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
