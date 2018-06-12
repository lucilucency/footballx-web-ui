import { combineReducers } from 'redux';
import reducer from './reducer';
import request from './request';
import tray from './tray';
import announcement from './announcement';

export default combineReducers({
  metadata: reducer('metadata', {}),
  records: reducer('records'),
  banner: reducer('banner', {}),

  community: reducer('community', {}),
  suggestedCommunities: reducer('suggestedCommunities'),

  posts: reducer('posts'),
  post: reducer('post', {}),
  comments: reducer('comments'),

  hotMatches: reducer('hotMatches'),
  matches: reducer('matches'),
  match: reducer('match', {}),

  seasons: reducer('seasons'),

  announcement,
  tray,
  request,
});
