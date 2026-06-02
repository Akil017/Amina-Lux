import type { Config } from "tailwindcss";

// Tailwind v4 — most config is now in globals.css via @theme
// This file only handles content paths
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
