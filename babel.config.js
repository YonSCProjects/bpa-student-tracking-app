module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/constants': './src/constants',
          '@/localization': './src/localization',
          '@/assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
