import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tropical: {
          blue: "#0EA5E9",
          teal: "#14B8A6",
          orange: "#F97316",
          sunset: "#FB923C",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-tropical": "linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)",
      },
    },
  },
  plugins: [],
};
export default config;