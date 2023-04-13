import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bully: '#80FF33'
      },
    },
  },
  plugins: [],
} satisfies Config;
