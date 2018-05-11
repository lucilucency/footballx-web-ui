import { combineReducers } from 'redux';
import reducer from './reducer';
import request from './request';
import form from './form';
import tray from './tray';

export default combineReducers({
  metadata: reducer('metadata'),
  records: reducer('records'),
  announcement: reducer('announcement'),

  suggestedCommunities: reducer('suggestedCommunities'),

  posts: reducer('posts'),
  post: reducer('post', {}),
  comments: reducer('comments'),

  form,
  tray,
  request,
});
