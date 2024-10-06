/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		colors: {
		  yellow: {
			100: '#fef9c3',
			200: '#fef08a',
			300: '#fde047',
			800: '#854d0e',
		  },
		  green: {
			600: '#16a34a',
		  },
		},
		
	  },
	},
	plugins: [
		function ({ addUtilities }) {
		  const newUtilities = {
			'.h1responsivetext': {
			  fontSize: 'clamp(0.75rem, 1.5vw + 0.5rem, 2rem)',
			},
		  };
		  addUtilities(newUtilities);
		},
	  ],
  }