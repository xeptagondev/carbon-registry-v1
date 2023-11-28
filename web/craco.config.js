const CracoLessPlugin = require('craco-less');
const TerserPlugin = require("terser-webpack-plugin");
const fs = require('fs');

const primaryColor = process.env.REACT_APP_THEME_COLOR || '#41af50';
const primaryGradient = process.env.REACT_APP_THEME_COLOR_GRADIENT || '#ffffff';
const imagePng = process.env.REACT_APP_LOGIN_IMAGE_PNG || '../../Assets/Images/login_main.png'
const imageWeb = process.env.REACT_APP_LOGIN_IMAGE_WEBP || '../../Assets/Images/login_main.webp'
const scssContent = `$theme-color: ${primaryColor};
$theme-gradient: ${primaryGradient};
$png-img: '${imagePng}';
$webp-img: '${imageWeb}';`;
fs.writeFileSync('theme.color.scss', scssContent);

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
              '@primary-color': primaryColor,
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
