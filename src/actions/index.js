import { dispatchPost, dispatchGet, dispatchPut, dispatchDelete, dispatchGET, dispatchPOST } from './dispatchAction';
import {
  parseCommentsInPost,
  parseCommentAfterCreate,
  parsePostAfterCreate,
  parsePostInMeFeeds,
} from './parser';
import { getCookie } from '../utils';

// auth
// export const login = (username, password) => dispatchAuth('auth', 'user/login', { username, password });
export const loginFb = accessToken => dispatchPost('metadata', 'xuser/auth', { access_token: accessToken });
export const refresh = xuser_id => dispatchGET({
  reducer: 'metadata',
  path: `xuser/${xuser_id}/refesh`,
  params: { xuser_id },
});
export const getMetadata = ({ access_token = getCookie('access_token'), user_id = getCookie('user_id') } = {}) => (dispatch) => {
  const getDataStart = payload => ({
    type: 'OK/metadata',
    payload,
  });

  let payload = {};
  if (access_token && user_id) {
    payload = {
      access_token,
      user: {
        id: user_id,
      },
    };
  }

  dispatch(getDataStart(payload));
};

// communities
export const getSuggestedCommunities = () => dispatchGet('suggestedCommunities', 'communities/suggestion', {}, resp => resp.communities);
export const subscribeCommunity = (communityID, {
  reducer = 'subscribedCommunities',
  path = `community/${communityID}/subscribe`,
} = {}) => dispatchGET({
  reducer,
  path,
});
// post
export const getMeFeeds = (sortby, xuser_id) => dispatchGET({
  reducer: 'posts',
  path: 'posts/following',
  params: {
    sortby,
    xuser_id,
  },
  transform: parsePostInMeFeeds,
});
export const getPostsWorld = sortby => dispatchGET({
  auth: false,
  reducer: 'posts',
  path: 'posts',
  params: {
    sortby,
  },
  transform: resp => resp.posts,
});
export const createPost = params => dispatchPost('ADD/posts', 'post', params, parsePostAfterCreate);
export const editPost = (id, params) => dispatchPut('EDIT/post', `post/${id}`, params);
export const deletePost = id => dispatchDelete('DELETE/post', `post/${id}`);
export const getPostComments = (postID, sortby, xuser_id) => dispatchGET({
  reducer: 'comments',
  path: `post/${postID}/comments`,
  params: {
    sortby,
    xuser_id,
  },
  transform: parseCommentsInPost,
});
export const createComment = (postID, {
  reducer = 'ADD/comments',
  reducerCallback = 'EDIT_ARR/posts',
  params,
  payload,
  payloadCallback,
} = {}) => dispatchPOST({
  reducer,
  reducerCallback,
  path: `post/${postID}/comment`,
  params,
  payload,
  transform: parseCommentAfterCreate,
  payloadCallback,
});

export const upVote = (target_id, {
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
  payload,
} = {}) => dispatchPOST({
  reducer,
  path,
  params: {
    target_id,
    vflag: 1,
  },
  payload,
  transform: (resp) => {
    const respClone = resp.target_vote;
    delete respClone.id;
    return respClone;
  },
});

export const downVote = (target_id, {
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
  payload,
} = {}) => dispatchPOST({
  reducer,
  path,
  params: {
    target_id,
    vflag: -1,
  },
  payload,
  transform: (resp) => {
    const respClone = resp.target_vote;
    delete respClone.id;
    return respClone;
  },
});

// user
const changeFollow = (userID, {
  reducer = 'EDIT/metadata',
  path = `xuser/${userID}/change-follow`,
  target_id,
  target_type,
  action_type,
}) => dispatchPOST({
  version: 'v1',
  reducer,
  path,
  params: {
    target_id,
    target_type,
    action: action_type,
  },
});
export const followUser = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'xuser',
  action_type: 'follow',
});
export const unfollowUser = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'xuser',
  action_type: 'unfollow',
});
export const followCommunity = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'community',
  action_type: 'follow',
});
export const unfollowCommunity = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'community',
  action_type: 'unfollow',
});


/**/
export const setSearchQuery = query => dispatch => dispatch(({
  type: 'QUERY/search',
  query,
}));
export const getSearchResult = query => dispatchPost('search', 'search', { q: query });
export const getSearchResultAndPros = query => dispatch => Promise.all([
  dispatch(setSearchQuery(query)),
  dispatch(getSearchResult(query)),
  // dispatch(getUsers()),
]);
export const getAnnouncement = merged => dispatchGet('announcement', 'search/issues', {
  q: `repo:footballx/web type:pr base:production label:release merged:>${merged}`,
  order: 'desc',
  page: 1,
  per_page: 1,
});

export * from './ajax';
export * from './dispatchForm';
export * from './dispatchAction';
export * from './request';
