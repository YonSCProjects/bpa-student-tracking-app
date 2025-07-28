import { I18nManager } from 'react-native';

export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};

export const forceRTL = (): void => {
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
    // Note: App restart is required for RTL changes to take effect
  }
};

export const forceLTR = (): void => {
  if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    // Note: App restart is required for RTL changes to take effect
  }
};

export const getTextDirection = (): 'rtl' | 'ltr' => {
  return I18nManager.isRTL ? 'rtl' : 'ltr';
};

export const getFlexDirection = (): 'row' | 'row-reverse' => {
  return I18nManager.isRTL ? 'row-reverse' : 'row';
};

export const getTextAlign = (): 'right' | 'left' => {
  return I18nManager.isRTL ? 'right' : 'left';
};

// Helper function to get appropriate margin/padding for RTL
export const getMarginStart = (value: number) => {
  return I18nManager.isRTL ? { marginRight: value } : { marginLeft: value };
};

export const getMarginEnd = (value: number) => {
  return I18nManager.isRTL ? { marginLeft: value } : { marginRight: value };
};

export const getPaddingStart = (value: number) => {
  return I18nManager.isRTL ? { paddingRight: value } : { paddingLeft: value };
};

export const getPaddingEnd = (value: number) => {
  return I18nManager.isRTL ? { paddingLeft: value } : { paddingRight: value };
};
