var admin = require("firebase-admin");

const getServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString());
  } else {
    throw new Error('Firebase credentials not provided in environment variables');
  }
};

admin.initializeApp({
  credential: admin.credential.cert(getServiceAccount())
});

export const getMessaging = () => admin.messaging;