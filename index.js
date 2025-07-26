import { AppRegistry, I18nManager } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

// Force RTL for Hebrew support
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
  // Note: This requires app restart to take effect
}

AppRegistry.registerComponent(appName, () => App);