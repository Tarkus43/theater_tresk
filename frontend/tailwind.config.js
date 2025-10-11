/*
 * tailwind CSS configuration file:
 * 1. specifies which files Tailwind should scan for class names
 * 2. defines a safelist of classes to always include (currently empty)
 * 3. customizes the design system under 'theme' (currently using default settings)
 * 4. registers any Tailwind plugins to extend functionality (none specified)
 */

/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './src/templates/**/*.{hbs,handlebars}',
  ],
  safelist: [],
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%, 100%': { opacity: '0' },
          '10%, 90%': { opacity: '1' },
        },
        image_opener: {
          from: { height: '0' },
          to: { height: '425px' },
        },
      },
      animation: {
        fade: 'fade 16s ease-in-out infinite',
        opener: 'image_opener 600ms ease-out forwards',
      },
    },

  },
  plugins: [],
};
