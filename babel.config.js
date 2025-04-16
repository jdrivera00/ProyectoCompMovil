export default function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'expo-router/babel',
        'react-native-reanimated/plugin' // este debe ir al final siempre
      ],
    };
  }
  