import mobileAds from 'react-native-google-mobile-ads';

export const AdMobService = {
  initialize: async () => {
    try {
      await mobileAds().initialize();
      console.log('AdMob initialized successfully.');
    } catch (e) {
      console.error('Error initializing AdMob:', e);
    }
  }
};
