module.exports = {
  style: {
    postcss: {
      mode: "file",
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
};
