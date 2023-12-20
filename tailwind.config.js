module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        example: ['ExampleFontFamily'],
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
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
  },
  plugins: [],
}
