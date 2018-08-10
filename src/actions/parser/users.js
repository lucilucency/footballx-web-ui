/* eslint-disable no-param-reassign */
import strings from '../../lang';
import { format } from '../../utils';

export const parseUserDetail = data => ({
  ...data.xuser,
});

export const parseNotifications = data => data.notification_logs.map((el) => {
  const msgTxt = el.notification;
  const msgObj = JSON.parse(msgTxt);
  const key = msgObj.BodyLocKey;
  const args = msgObj.BodyLocArgs;
  const msg = format(strings[`topic_${key}`], ...args);
  delete el.notification;

  return {
    ...el,
    msg,
  };
});
