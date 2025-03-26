/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // ha használod az `/app` mappát is
  ],
  theme: {
    extend: {
      animation: {
        energyShift: 'energyShift 20s linear infinite',
      },
      keyframes: {
        energyShift: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        }
      }
    }
  },
  variants: {
    scrollbar: ['rounded'],
  }
}
