/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        thin: 'Poppins-Thin',
        extralight: 'Poppins-ExtraLight',
        light: 'Poppins-Light',
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        semibold: 'Poppins-SemiBold',
        bold: 'Poppins-Bold',
        extrabold: 'Poppins-ExtraBold',
        black: 'Poppins-Black',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.font-thin': { fontFamily: 'Poppins-Thin' },
        '.font-extralight': { fontFamily: 'Poppins-ExtraLight' },
        '.font-light': { fontFamily: 'Poppins-Light' },
        '.font-normal': { fontFamily: 'Poppins-Regular' },
        '.font-medium': { fontFamily: 'Poppins-Medium' },
        '.font-semibold': { fontFamily: 'Poppins-SemiBold' },
        '.font-bold': { fontFamily: 'Poppins-Bold' },
        '.font-extrabold': { fontFamily: 'Poppins-ExtraBold' },
        '.font-black': { fontFamily: 'Poppins-Black' },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
