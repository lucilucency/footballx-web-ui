import firebase from './firebase';

/** FUNCTION DECLARATION */
function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}
function isTokenSentToServer() {
  return Number(window.localStorage.getItem('sentToServer')) === 1;
}
// eslint-disable-next-line no-unused-vars
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.warn('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.warn('Token already sent to server so won\'t send it again ' +
      'unless it changes');
  }
}
function handleTokenRefresh(messaging) {
  return messaging.getToken().then((token) => {
    console.warn('handle token refresh', token);
    setTokenSentToServer(true);
  });
}
function subscribeToNotifications(messaging) {
  console.warn('do subscribe');
  messaging.requestPermission()
    .then(() => handleTokenRefresh())
    .catch((err) => {
      console.warn('error getting permission', err);
    });
}
function unsubscribeFromNotifications(messaging) {
  console.warn('un subscribe');
  messaging.getToken()
    .then(token => messaging.deleteToken(token))
    .catch((err) => {
      console.warn('error deleting token :(', err);
    });
}
function subscribeTokenToTopic(messaging, topic) {
  const doSubscribe = (token) => {
    fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      if (response.status < 200 || response.status >= 400) {
        // eslint-disable-next-line no-throw-literal
        throw `Error subscribing to topic: ${response.status} - ${response.text()}`;
      }
      console.warn('Subscribed to topic: ', topic);
    }).catch((error) => {
      console.error(error);
    });
  };

  messaging.requestPermission().then(() => {
    console.warn('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.warn('token: ', currentToken);
          doSubscribe(messaging, currentToken);
        } else {
          // Show permission request.
          console.warn('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
        }
      })
      .catch((err) => {
        console.warn('An error occurred while retrieving token. ', err);
      });
  });
}

const messaging = firebase.messaging();
messaging.usePublicVapidKey(process.env.REACT_APP_FIREBASE_WEB_PUSH_KEY_PARE);

messaging.onTokenRefresh(handleTokenRefresh);

export {
  messaging,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  subscribeTokenToTopic,
};

