/* eslint-disable no-throw-literal */
import firebase from './firebase';
import { ajaxPost } from './actions/ajax';
import { getCookie } from './utils/index';


/** FUNCTION DECLARATION */


function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}
function isTokenSentToServer() {
  return Number(window.localStorage.getItem('sentToServer')) === 1;
}
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    const userID = getCookie('user_id');
    // Send the current token to your server.
    if (userID) {
      console.warn('Send device token to server', currentToken);
      ajaxPost({
        version: 'v1',
        path: `xuser/${userID}/devicetoken`,
        params: {
          device: 'web',
          token: currentToken,
          device_id: `xuser-${userID}-web`,
        },
      }, setTokenSentToServer(true));
    }
  } else {
    console.warn('Token already sent to server so won\'t send it again unless it changes');
  }
}
function refreshToken(messaging) {
  messaging.requestPermission().then(() => {
    messaging.getToken().then((refreshedToken) => {
      setTokenSentToServer(false);
      sendTokenToServer(refreshedToken);
    }).catch((err) => {
      console.warn('Unable to retrieve refreshed token ', err);
    });
  }).catch((err) => {
    console.warn('error getting permission', err);
  });
}
function subscribeToNotifications(messaging) {
  messaging.requestPermission()
    .then(() => refreshToken(messaging))
    .catch((err) => {
      console.warn('error getting permission', err);
    });
}
function unSubscribeFromNotifications(messaging) {
  messaging.getToken()
    .then(token => messaging.deleteToken(token))
    .catch((err) => {
      console.warn('error deleting token :(', err);
    });
}
function subscribeTokenToTopic(messaging, topic) {
  messaging.requestPermission().then(() => {
    // Retrieve an Instance ID token for use with FCM.
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          // subscribe to topic
          fetch(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/${topic}`, {
            method: 'POST',
            headers: new Headers({
              Authorization: `key=${process.env.REACT_APP_FIREBASE_SERVER_KEY}`,
              'Content-Type': 'application/json',
            }),
          }).then((response) => {
            if (response.status < 200 || response.status >= 400) {
              throw `Error subscribing to topic: ${response.status} - ${response.text()}`;
            }
            console.warn('Subscribed to topic: ', topic);
          }).catch((error) => {
            console.error(error);
          });
        } else {
          console.warn('No Instance ID token available. Request permission to generate one.');
          // TODO(developer): show permission request UI.
        }
      })
      .catch((err) => {
        console.warn('An error occurred while retrieving token. ', err);
        // TODO(developer): try again
      });
  });
}

const messaging = firebase && firebase.messaging();
if (messaging) {
  messaging.usePublicVapidKey(process.env.REACT_APP_FIREBASE_WEB_PUSH_KEY_PARE);
  messaging.onTokenRefresh(() => {
    refreshToken(messaging);
  });
}

export {
  messaging,
  subscribeToNotifications,
  unSubscribeFromNotifications,
  refreshToken,
  subscribeTokenToTopic,
};

