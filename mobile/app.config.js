import 'dotenv/config';

export default {
  expo: {
    name: 'Snapshoot',
    slug: 'snapshoot',
    version: '1.0.0',
    sdkVersion: '53.0.0',
    scheme: 'snapshoot',            
    plugins: ['expo-secure-store'],
    orientation: 'portrait',
    platforms: ['ios', 'android'],
    extra: {
      apiHost: process.env.EXPO_PUBLIC_API_HOST || 'http://10.0.2.2'
    },
    ios: {
      newArchEnabled: false,
      supportsTablet: false,
      infoPlist: {
        NSCameraUsageDescription: 'Accès caméra pour prendre des snaps',
        NSMicrophoneUsageDescription: 'Accès micro pour vidéo 10 s',
        NSLocationWhenInUseUsageDescription:
          'Localisation pour découvrir les stories proches'
      },
      deploymentTarget: '13.0'
    },
    android: {
      newArchEnabled: false,
      permissions: [
        'CAMERA',
        'RECORD_AUDIO',
        'ACCESS_FINE_LOCATION',
        'INTERNET',
        'WRITE_EXTERNAL_STORAGE'
      ],
      package: 'com.snapshoot.app'
    }
  }
};
