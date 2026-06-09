import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#faf6f1",
        ink: "#1a1a2e",
        cedar: "#c9a84c",
        madder: "#8b1a1a",
        brass: "#d4a853",
        mist: "#f0ebe3",
        emerald: "#2d6a4f",
        jade: "#4ade80",
        onyx: "#16213e"
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        archival: "0 18px 50px rgba(201, 168, 76, 0.12)",
        "card-hover": "0 24px 60px rgba(201, 168, 76, 0.18)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glow-gold": "0 0 40px rgba(201, 168, 76, 0.15)"
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "fade-in-up-delay-1": "fade-in-up 0.6s ease-out 0.1s both",
        "fade-in-up-delay-2": "fade-in-up 0.6s ease-out 0.2s both",
        "fade-in-up-delay-3": "fade-in-up 0.6s ease-out 0.3s both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite"
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c9a84c 0%, #d4a853 50%, #b8963f 100%)",
        "hero-gradient": "linear-gradient(135deg, #16213e 0%, #1a1a2e 40%, #0f3460 100%)",
        "warm-gradient": "linear-gradient(180deg, #faf6f1 0%, #f0ebe3 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
