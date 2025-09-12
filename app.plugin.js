module.exports = ({ config }) => {
  return {
    ...config,
    plugins: [
      ...(config.plugins || []),
      [
        "react-native-maps",
        {
          // Configuration options for react-native-maps
          androidApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          iosApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      ]
    ]
  };
};
