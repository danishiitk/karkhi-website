import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#eff8ff",
        ink: "#12263a",
        cedar: "#0369a1",
        madder: "#1d4ed8",
        brass: "#0ea5e9",
        mist: "#dbeafe"
      },
      boxShadow: {
        archival: "0 18px 50px rgba(3, 105, 161, 0.14)"
      }
    }
  },
  plugins: []
} satisfies Config;
