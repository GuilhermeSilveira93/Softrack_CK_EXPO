module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        example: ['ExampleFontFamily'],
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      colors: {
        dark: {
          100: 'rgb(0, 255, 159)',
          200: '#465DFF',
          300: '#293541',
          400: '#0d0d0d',
          500: '#f00',
        },
        light: {
          100: 'rgb(0, 255, 159)',
          200: '#465DFF',
          300: '#293541',
          400: '#0d0d0d',
        },
      },
    },
    fontSize: {
      sm: '0.5rem',
      base: '0.688rem',
      xl: '1.25rem',
    },
  },
  plugins: [],
}
