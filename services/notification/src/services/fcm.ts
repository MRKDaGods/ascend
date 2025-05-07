var admin = require("firebase-admin");

var serviceAccount = require("ascend-46a60-firebase-adminsdk-fbsvc-5f4948f52d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const getMessaging = () => admin.messaging;