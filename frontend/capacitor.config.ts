import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thesaddles.club',
  appName: 'The Saddles',
  webDir: 'dist',
  // When running on a real device, point to your deployed backend URL.
  // For local dev with a physical device, replace with your machine's LAN IP.
  server: {
    // androidScheme: 'https',  // uncomment for production
    // url: 'https://your-production-domain.com',  // uncomment for production
    cleartext: true,  // allow HTTP during development
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a3d1c',
      showSpinner: false,
    },
  },
};

export default config;
