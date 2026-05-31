import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#fbfaf7",
        line: "#e6e1d8",
        accent: "#0f766e"
      },
      borderRadius: {
        ui: "8px"
      }
    }
  },
  plugins: []
};

export default config;
