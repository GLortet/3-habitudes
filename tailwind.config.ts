import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f3",
          100: "#e4ece1",
          300: "#adc7a8",
          500: "#71956f",
          700: "#4d6f4e",
        },
        ink: "#263238",
        mist: "#eef3f5",
        slateblue: "#566b78",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(38, 50, 56, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
