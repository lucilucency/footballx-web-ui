// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
// import 'firebase/auth';
import 'firebase/database';
// import 'firebase/firestore';

// Initalize and export Firebase.
const config = {
  apiKey: 'AIzaSyBWnUpOywLBYuJu2PTr-EImXLQ7gR4Gc9g',
  authDomain: 'nationalteam-6115099.firebaseapp.com',
  databaseURL: 'https://nationalteam-6115099.firebaseio.com',
  projectId: 'nationalteam-6115099',
  storageBucket: 'nationalteam-6115099.appspot.com',
  messagingSenderId: '196661259533',
};

export default firebase.initializeApp(config);
