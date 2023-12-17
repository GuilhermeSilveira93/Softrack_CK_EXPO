module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // eslint-disable-next-line prettier/prettier
        dark: {
          1: 'rgb(0, 255, 159)',
          2: '#465DFF',
          3: '#293541',
          4: '#061218',
          5: '#FF0000',
        },
        // eslint-disable-next-line prettier/prettier
        light: {
          1: 'rgb(0, 255, 159)',
          2: '#465DFF',
          3: '#293541',
          4: '#121824',
        },
      },
    },
  },
  plugins: [],
}
