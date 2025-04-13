import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    return android;
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyB93DvlzJOhua-VwNTn6LgR0ApuGS_1i2w',
    appId: '1:653003737386:android:4cd6f838ebc6772ef77653',
    messagingSenderId: '653003737386',
    projectId: 'asscend-68618',
    storageBucket: 'asscend-68618.firebasestorage.app',
  );
}