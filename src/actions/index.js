import { dispatchPost, dispatchGet, dispatchPut, dispatchDelete, dispatchGET, dispatchPOST } from './dispatchAction';
import {
  parseCommentsInPost,
  parseCommentAfterCreate,
  parsePostAfterCreate,
} from './parser';

// auth
// export const login = (username, password) => dispatchAuth('auth', 'user/login', { username, password });
export const loginFb = accessToken => dispatchPost('metadata', 'xuser/auth', { access_token: accessToken });
export const refresh = (xuser_id, token) => dispatchGET({
  token,
  reducer: 'metadata',
  path: `xuser/${xuser_id}/refesh`,
  params: { xuser_id },
});

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
  transform: resp => resp.posts,
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
export const createComment = ({ post_id, submit_data, payload }) => dispatchPost('ADD/comments', `post/${post_id}/comment`, submit_data, parseCommentAfterCreate, payload);
export const upVote = (postID, {
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
  payload,
} = {}) => dispatchPOST({
  reducer,
  path,
  params: {
    target_id: postID,
    vflag: 1,
  },
  payload,
  transform: (resp) => {
    const respClone = resp.target_vote;
    delete respClone.id;
    return respClone;
  },
});

export const downVote = (postID, {
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
  payload,
} = {}) => dispatchPOST({
  reducer,
  path,
  params: {
    target_id: postID,
    vflag: -1,
  },
  payload,
  transform: (resp) => {
    const respClone = resp.target_vote;
    delete respClone.id;
    return respClone;
  },
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
export * from './request';
