const CracoLessPlugin = require('craco-less');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  babel: {
    loaderOptions: {
      // this option lets us display the map-pin marker layer - without this it does not work: https://github.com/visgl/react-map-gl/issues/1266
      ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#41af50',
              '@layout-sider-menu-container': '#ECE8FD',
              '@component-background': '#FFFFFF',
              '@layout-header-background': '#ECE8FD',
              '@layout-body-background': '#ECE8FD',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.optimization.minimizer.push(new TerserPlugin({ parallel: true }));
          return webpackConfig;
        }
      }
    }
  ],
};
