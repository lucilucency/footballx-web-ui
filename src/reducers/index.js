import { combineReducers } from 'redux';
import reducer from './reducer';
import request from './request';
import form from './form';
import tray from './tray';

export default combineReducers({
  metadata: reducer('metadata'),
  records: reducer('records'),
  announcement: reducer('announcement'),

  posts: reducer('posts'),

  form,
  tray,
  request,
});
