/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// const config = {
//   apiKey: 'AIzaSyCGjNTtY-6Ec0rxRh-HRQqFt1MlQ6YODDY',
//   authDomain: 'footballx-dev.firebaseapp.com',
//   databaseURL: 'https://footballx-dev.firebaseio.com',
//   projectId: 'footballx-dev',
//   storageBucket: 'footballx-dev.appspot.com',
//   messagingSenderId: '738646846066',
// };

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER,
};

// const firebaseConfig = process.env.NODE_ENV === 'production'
//   ? prodConfig
//   : config;

/* global firebase */
/* global clients */

// TODO: fill in messaging sender id
firebase.initializeApp(config);

const messaging = firebase && firebase.messaging();

self.addEventListener('notificationclick', (event) => {
  // Event actions derived from event.notification.data from data received
  const eventURL = event.notification.data;
  event.notification.close();
  if (event.action === 'confirmAttendance') {
    clients.openWindow(eventURL.confirm);
  } else {
    clients.openWindow(eventURL.decline);
  }
}, false);

messaging.setBackgroundMessageHandler((payload) => {
  if (payload && payload.data) {
    let { body_loc_args } = payload.data;
    const { body_lock_key } = payload.data;
    body_loc_args = JSON.parse(body_loc_args);

    if (body_lock_key === 'XUSER_TOPUP_XCOIN_SUCCESS') {
      const notificationTitle = body_loc_args[0];
      const notificationOptions = {
        body: body_loc_args[1],
        icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png',
        // actions: [
        //   { action: 'confirmAttendance', title: 'Confirm attendance' },
        //   { action: 'cancel', title: 'Not coming' },
        // ],
        // For additional data to be sent to event listeners, needs to be set in this data {}
        // data: { confirm: data.confirm, decline: data.decline },
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    }
  }
});
