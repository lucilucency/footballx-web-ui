import { dispatchGet, dispatchDelete, dispatchGET, dispatchPOST, dispatchPUT } from './dispatchAction';
import {
  parseCommentsInPost,
  parseCommentAfterCreate,
  parsePostAfterCreate,
  parsePostInMeFeeds,
} from './parser';
import { getCookie, setCookie, eraseCookie } from '../utils';

// auth
// export const login = (username, password) => dispatchAuth('auth', 'user/login', { username, password });
export const loginFb = access_token => dispatchPOST({
  reducer: 'metadata',
  path: 'xuser/auth',
  params: { access_token },
  callback: (resp) => {
    setCookie('access_token', resp.access_token, 7);
    setCookie('user_id', resp.user.id, 7);
    setCookie('username', resp.user.username, 7);
  },
});
export const refresh = xuser_id => dispatchGET({
  reducer: 'metadata',
  path: `xuser/${xuser_id}/refesh`,
  params: { xuser_id },
  callback: (resp) => {
    if (resp.user.username) {
      setCookie('username', resp.user.username, 7);
    } else {
      eraseCookie('username');
    }
  },
});
export const getMetadata = ({
  access_token = getCookie('access_token'),
  user_id = getCookie('user_id'),
  nickname = getCookie('nickname'),
  username = getCookie('username'),
} = {}) => (dispatch) => {
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
        nickname,
        username,
      },
    };
  }
  dispatch(getDataStart(payload));
};
export const updateMetadata = user => dispatch => dispatch(({
  type: 'OK/EDIT/metadata',
  payload: {
    user,
  },
}));
export const updateUserProfile = (userID, params, payload) => dispatchPUT({
  reducer: 'EDIT/metadata',
  path: `xuser/${userID}`,
  params,
  payload: {
    user: payload,
  },
  transform: resp => ({ user: resp.xuser }),
  callback: () => {
    setCookie('username', payload.username, 7);
  },
});

// communities
export const getSuggestedCommunities = () => dispatchGet('suggestedCommunities', 'communities/suggestion', {}, resp => resp.communities);
export const subscribeCommunity = (communityID, {
  reducer = 'subscribedCommunities',
  path = `community/${communityID}/subscribe`,
} = {}) => dispatchGET({ reducer, path });
// post
export const getMeFeeds = ({ sortby = 'new', xuser_id }) => dispatchGET({
  reducer: 'posts',
  path: 'posts/following',
  params: {
    sortby,
    xuser_id,
  },
  transform: parsePostInMeFeeds,
});
export const getPostsWorld = ({ sortby = 'new', xuser_id }) => dispatchGET({
  auth: false,
  reducer: 'posts',
  path: 'posts',
  params: {
    sortby,
    xuser_id,
  },
  transform: parsePostInMeFeeds,
});
export const createPost = ({ params, payload }) => dispatchPOST({
  reducer: 'ADD/posts',
  path: 'post',
  params,
  payload,
  transform: parsePostAfterCreate,
});
export const editPost = (id, params) => dispatchPUT({
  reducer: 'EDIT/post',
  path: `post/${id}`,
  params,
});
export const deletePost = id => dispatchDelete('DELETE/post', `post/${id}`);
export const setPost = payload => dispatch => dispatch(({
  type: 'OK/post',
  payload,
}));
export const getPostComments = (postID, sortby, xuser_id) => dispatchGET({
  reducer: 'comments',
  path: `post/${postID}/comments`,
  params: {
    sortby,
    xuser_id,
  },
  transform: parseCommentsInPost,
});
export const createComment = ({
  reducer = 'ADD/comments',
  reducerCallback = 'EDIT_ARR/posts',
  params,
  payload,
  payloadCallback,
} = {}) => dispatchPOST({
  reducer,
  reducerCallback,
  path: 'post-comment',
  params,
  payload,
  transform: parseCommentAfterCreate,
  payloadCallback,
});

export const changeVote = (target_id, vflag, {
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
  payload,
} = {}) => dispatchPOST({
  reducer,
  path,
  params: {
    target_id,
    vflag,
  },
  payload,
  transform: (resp) => {
    const respClone = resp.target_vote;
    delete respClone.id;
    return respClone;
  },
});

export const upVote = (target_id, params, type = 'post') => dispatch => Promise.all([
  dispatch(changeVote(target_id, 1, params)),
  type === 'post' && dispatch(setPost(params.payload)),
]);

export const downVote = (target_id, params, type = 'post') => dispatch => Promise.all([
  dispatch(changeVote(target_id, -1, params)),
  type === 'post' && dispatch(setPost(params.payload)),
]);

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
export const getSearchCommunities = query => dispatchGET({
  reducer: 'search',
  path: 'communities',
  params: {
    query,
  },
});
export const getSearchUsers = query => dispatchGET({
  reducer: 'search',
  path: 'communities',
  params: {
    query,
  },
});
export const getSearchResultAndPros = query => dispatch => Promise.all([
  dispatch(setSearchQuery(query)),
  dispatch(getSearchCommunities(query)),
  // dispatch(getSearchUsers(query)),
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
