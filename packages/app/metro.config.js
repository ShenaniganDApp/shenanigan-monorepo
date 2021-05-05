/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        })
    },
    resolver: {
        extraNodeModules: require('node-libs-browser')
    },
    projectRoot: path.resolve(__dirname, '../../')
};
