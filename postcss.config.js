module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      '@fullhuman/postcss-purgecss': {
        content: ['./src/**/*.{js,ts,jsx,tsx}'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [/^gsap/, /^animate-/, /reveal/, /stagger/],
      },
    }),
  },
};
