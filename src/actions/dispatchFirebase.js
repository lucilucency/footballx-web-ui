/* eslint-disable import/prefer-default-export */
export const onMessage = payload => dispatch => dispatch({
  type: 'OK/firebaseOnMessage',
  payload,
});
