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
          '10%, 40%': { opacity: '1' },
          '50%, 90%': { opacity: '0' },
        },
        image__opener: {
          from: { height: '0' },
          to: { height: '425vh' },
        },
      },
      animation: {
        fade: 'fade 16s infinite ease-in-out',
        opener: 'image__opener 1s ease-in-out',
      },
    },
  },
  plugins: [],
};
