var config = {
   apiKey: process.env.API_KEY,
   authDomain: process.env.AUTH_DOMAIN,
   databaseURL: process.env.CONFIG_DATABASE_URL,
   storageBucket: process.env.CONFIG_STORAGE_BUCKET,
   messagingSenderId: process.env.MESSAGING_SENDER_ID
 };
 firebase.initializeApp(config);
