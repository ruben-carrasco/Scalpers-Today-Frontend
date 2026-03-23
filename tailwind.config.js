/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/presentation/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#000000', // Pure Black
          card: '#18181B',    // Dark Gray (Zinc 900)
          elevated: '#27272A', // Lighter Gray (Zinc 800)
        },
        border: {
          DEFAULT: '#27272A',
          subtle: '#3F3F46', // Zinc 700
          focus: '#3B82F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA', // Zinc 400
          muted: '#71717A', // Zinc 500
          dim: '#52525B', // Zinc 600
        },
        brand: {
          primary: '#3B82F6',
          primaryDark: '#2563EB',
          accent: '#8B5CF6',
          accentLight: '#60A5FA',
        },
        semantic: {
          success: '#34D399', // Emerald 400 (Bullish)
          warning: '#FBBF24', // Amber 400 (Medium)
          danger: '#FF453A',  // Apple Red (Bearish/High)
        },
        impact: {
          high: '#FF453A',
          medium: '#FBBF24',
          low: '#A1A1AA',
        }
      },
    },
  },
  plugins: [],
}
