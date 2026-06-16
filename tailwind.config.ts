import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stiucastiiOrange: "#F26B25",
        stiucastiiBlue: "#0A87DD",
        stiucastiiDark: "#111111",
        stiucastiiLight: "#FFFFFF",
      },
      fontFamily: {
        barlow: ["var(--font-barlow)", "Barlow", "Arial", "sans-serif"],
      },
      boxShadow: {
        game: "0 7px 7px rgba(0, 0, 0, 0.22)",
        soft: "0 12px 26px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        gameGradient:
          "linear-gradient(90deg, #F26B25 0%, #9B9BB5 50%, #0A87DD 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
