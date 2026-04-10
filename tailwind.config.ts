import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        creme: "#F5F2ED",
        ink: "#0D0D0D",
        accent: "#C1392B",
        line: "#0D0D0D",
        muted: "#6B6A66",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "serif"],
        sans: ['"Syne"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderWidth: {
        hair: "1px",
      },
      transitionTimingFunction: {
        surgical: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
