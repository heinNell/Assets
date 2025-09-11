// react-native.config.js
module.exports = {
    dependencies: {
        'fabric-or-tm-library': {
            platforms: {
                android: {
                    libraryName: null,
                    componentDescriptors: null,
                    cmakeListsPath: null,
                    cxxModuleCMakeListsModuleName: null,
                    cxxModuleCMakeListsPath: null,
                    cxxModuleHeaderName: null,
                },
            },
        },
        'some-unsupported-package': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided
            },
        },
    },
};