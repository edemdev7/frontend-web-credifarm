import { heroui } from "@heroui/react";
import fluid, { extract, fontSize, screens } from "fluid-tailwind";
/** @type {import('tailwindcss').Config} */

export default {
  content: {
    files: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    extract,
  },
  safelist: [
    ...Array(65)
      .fill()
      .map((_, i) => `delay-[${i * 50}ms]`),
    ...Array(165)
      .fill()
      .map((_, i) => `animate-delay-[${i * 50}ms]`),
    "z-60",
    "z-70",
  ],
  theme: {
    extend: {
      screens,
      fontSize,
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
      },
      spacing: {
        "bubble-lg": "clamp(200px, 45vw, 500px)",
        "bubble-md": "clamp(150px, 40vw, 400px)",
        "bubble-sm": "clamp(100px, 30vw, 300px)",
      },
      zIndex: {
        60: "60",
        70: "70",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), fluid],
};
