import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0A1224",
        porcelain: "#F5F3EE",
        surface: "#EDEAE2",
        accent: "#FFB020",
        cobalt: "#1A46CC",
        mist: "#8791A6"
      }
    }
  },
  plugins: []
};

export default config;
