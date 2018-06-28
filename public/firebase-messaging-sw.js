/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// const prodConfig = {
//   apiKey: 'AIzaSyA65s_6yPsTyvoRUNJ6zkSe1JfB0hokd5M',
//   authDomain: 'footballx-f8db2.firebaseapp.com',
//   databaseURL: 'https://footballx-f8db2.firebaseio.com',
//   projectId: 'footballx-f8db2',
//   storageBucket: 'footballx-f8db2.appspot.com',
//   messagingSenderId: '318454074670',
// };

const devConfig = {
  apiKey: 'AIzaSyCGjNTtY-6Ec0rxRh-HRQqFt1MlQ6YODDY',
  authDomain: 'footballx-dev.firebaseapp.com',
  databaseURL: 'https://footballx-dev.firebaseio.com',
  projectId: 'footballx-dev',
  storageBucket: 'footballx-dev.appspot.com',
  messagingSenderId: '738646846066',
};

// const firebaseConfig = process.env.NODE_ENV === 'production'
//   ? prodConfig
//   : devConfig;

/* global firebase */
/* global clients */

// TODO: fill in messaging sender id
firebase.initializeApp(devConfig);

const messaging = firebase.messaging();

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
    body_loc_args = JSON.parse(body_loc_args);

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
});
