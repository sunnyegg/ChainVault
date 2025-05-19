import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../node_modules/@tixia/design-system/dist/**/*.{js,ts,jsx,tsx}"

  ],
  // important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007C99",
          50: "#E6F7FA", // Lightest tint
          100: "#B3E6F0",
          200: "#80D5E6",
          300: "#4DC4DC",
          400: "#1AB3D2",
          500: "#007C99", // Base color
          600: "#006B80",
          700: "#005A66",
          800: "#00494D",
          900: "#003833", // Darkest shade
        },
        secondary: {
          DEFAULT: "#336AFF",
          50: "#F5F8FF",
          100: "#E0E9FF",
          200: "#CCDAFF",
          300: "#99B5FF",
          400: "#668FFF",
          500: "#336AFF",
          600: "#0040FF",
          700: "#002DB3",
          800: "#001A66",
          900: "#000D33",
        },
        // Semantic Colors
        success: {
          DEFAULT: "#00B37D",
          50: "#E6F9F0",
          100: "#B3EED9",
          200: "#80E3C2",
          300: "#4DD8AB",
          400: "#1ACD94",
          500: "#00B37D",
          600: "#009966",
          700: "#00804D",
          800: "#006633",
          900: "#004D1A",
        },
        warning: {
          DEFAULT: "#FFB300",
          50: "#FFF9E6",
          100: "#FFEEB3",
          200: "#FFE380",
          300: "#FFD84D",
          400: "#FFCD1A",
          500: "#FFB300",
          600: "#CC9000",
          700: "#996D00",
          800: "#664A00",
          900: "#332700",
        },
        danger: {
          DEFAULT: "#E60000",
          50: "#FFE6E6",
          100: "#FFB3B3",
          200: "#FF8080",
          300: "#FF4D4D",
          400: "#FF1A1A",
          500: "#E60000",
          600: "#B30000",
          700: "#800000",
          800: "#4D0000",
          900: "#1A0000",
        },
        info: {
          DEFAULT: "#0073E6",
          50: "#E6F2FF",
          100: "#B3D9FF",
          200: "#80C0FF",
          300: "#4DA6FF",
          400: "#1A8DFF",
          500: "#0073E6",
          600: "#0059B3",
          700: "#004080",
          800: "#00264D",
          900: "#000D1A",
        },
        // Neutral Colors
        neutral: {
          DEFAULT: "#6C757D",
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#121416",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "primary-custom": "0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
        "secondary-custom": "0px 1px 2px 0px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        bgLogin: "url('/src/assets/bglogintixia.png')",
      },
    },
  },
  darkMode: ["class", "class"],
  plugins: [],
};

export default config; 