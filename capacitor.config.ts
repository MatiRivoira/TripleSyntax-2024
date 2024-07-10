import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'food',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    "SplashScreen": {
     // "launchShowDuration": 1000,
      "launchAutoHide": false,
      //"launchFadeOutDuration": 1000,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
      
    },
  
   
    
  },
  
};

export default config;
