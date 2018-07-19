/* eslint-disable camelcase,radix */
import { dispatchDelete, dispatchGet, dispatchPost, dispatchPut } from './dispatchData';
import * as parser from './parser';
import { getCookie, setCookie, eraseCookie } from '../utils';

const PAGE_LIMIT = 50;

export const localUpdateReducer = (name, payload) => dispatch => dispatch({
  type: `OK/LOCAL_EDIT/${name}`,
  payload,
});
export const localSetReducer = (name, payload) => dispatch => dispatch({
  type: `OK/${name}`,
  payload,
});
export const localLoadingReducer = (name, payload) => dispatch => dispatch({
  type: `REQUEST/${name}`,
  payload,
});

// auth
export const loginFb = access_token => dispatchPost({
  reducer: 'metadata',
  path: 'xuser/auth',
  params: { access_token },
  callback: (resp) => {
    setCookie('access_token', resp.access_token);
    setCookie('user_id', resp.user.id);
    setCookie('username', resp.user.username);
  },
});
export const refresh = (xuser_id = getCookie('user_id')) => dispatchGet({
  reducer: 'EDIT/metadata',
  path: `xuser/${xuser_id}/refesh`,
  params: { xuser_id },
  callback: (resp) => {
    if (resp.user.username) {
      setCookie('username', resp.user.username);
    } else {
      eraseCookie('username');
    }
  },
});
export const getMetadata = ({
  access_token = getCookie('access_token'),
  user_id = Number(getCookie('user_id')),
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
      following: {},
      user: {
        id: user_id,
        username,
      },
    };
  }
  dispatch(getDataStart(payload));
};
export const localUpdateMetadata = payload => dispatch => dispatch({
  type: 'OK/EDIT/metadata',
  payload,
});
export const updateUserProfile = (params, payload) => dispatchPut({
  reducer: 'EDIT/metadata',
  path: `xuser/${getCookie('user_id')}`,
  params,
  payload: {
    user: payload,
  },
  transform: resp => ({ user: resp.xuser }),
  callback: () => {
    if (!getCookie('username')) {
      setCookie('username', payload.username);
    }
  },
});


/**
 *
 * POST
 *
 * */
export const getMeFeeds = ({
  sortby, xuser_id, limit = PAGE_LIMIT, offset = 0,
}) => dispatchGet({
  reducer: 'posts',
  path: 'posts/following',
  params: {
    sortby, xuser_id, limit, offset,
  },
  transform: parser.parsePostInMeFeeds,
});
export const getWorldFeeds = ({
  sortby, xuser_id, limit = PAGE_LIMIT, offset = 0,
}) => dispatchGet({
  auth: false,
  reducer: 'posts',
  path: 'posts',
  params: {
    sortby, xuser_id, limit, offset,
  },
  transform: parser.parsePostInMeFeeds,
});
export const getCommunityFeeds = (communityID, {
  limit = PAGE_LIMIT, offset = 0, sortby, xuser_id,
}) => dispatchGet({
  reducer: 'posts',
  path: `community/${communityID}/posts`,
  params: {
    limit, offset, sortby, xuser_id,
  },
  transform: parser.parsePostInMeFeeds,
});

export const createPost = ({ params, payload }) => dispatchPost({
  reducer: 'ADD/posts',
  path: 'post',
  params,
  payload,
  transform: parser.parsePostAfterCreate,
});
export const editPost = (id, params) => dispatchPut({
  reducer: 'EDIT/post',
  path: `post/${id}`,
  params,
});
export const deletePost = id => dispatchDelete('DELETE/post', `post/${id}`);
export const setPost = payload => dispatch => dispatch(({
  type: 'OK/post',
  payload,
}));
export const getPost = postID => dispatchGet({
  reducer: 'post',
  path: `post/${postID}`,
  params: {
    xuser_id: Number(getCookie('user_id')),
  },
  transform: parser.parsePost,
});
export const getCommentsInPost = (postID, sortby, xuser_id) => dispatchGet({
  reducer: 'comments',
  path: `post/${postID}/comments`,
  params: {
    sortby,
    xuser_id,
  },
  transform: parser.parseCommentsInPost,
});
export const commentInPost = ({
  params,
  /**/
  payload,
  payloadCallback,
  reducer,
  reducerCallback,
} = {}) => dispatchPost({
  reducer,
  reducerCallback,
  path: 'post-comment',
  params,
  payload,
  transform: parser.parseCommentAfterCommentInPost,
  payloadCallback,
});

export const changeVote = (target_id, vflag, {
  payload,
  reducer = 'EDIT_ARR/posts',
  path = 'post/change-vote',
} = {}) => dispatchPost({
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

/**
 *
 * MATCH
 *
 * */

export const getMatches = ({ start_time = parseInt(Date.now() / 1000), end_time = parseInt(Date.now() / 1000) + 2592000 } = {}) => dispatchGet({
  reducer: 'matches',
  path: 'matches',
  params: {
    start_time,
    end_time,
  },
  transform: parser.parseMatches,
});
/* export const getHotMatches = ({
  reducer = 'hotMatches', path = 'matches/hot',
} = {}) => dispatchGet({
  reducer, path, transform: parser.parseMatches,
});
export const updateMatch = payload => dispatch => dispatch({
  type: 'OK/EDIT_ARR/matches', payload,
}); /!* update match after get votes of hot matches *!/ */
export const setMatch = payload => dispatch => dispatch({
  type: 'OK/EDIT/match',
  payload,
});
export const getMatch = matchID => dispatchGet({
  reducer: 'EDIT/match',
  path: `match/${matchID}`,
  transform: parser.parseMatchInMatchDetail,
});
export const getMatchVotes = (matchID, callback) => dispatchGet({
  reducer: 'EDIT/match',
  path: `match/${matchID}/votes`,
  callback,
});
export const hitVote = (matchID, teamID, payload) => dispatchPost({
  params: { club_id: teamID },
  payload,
  /**/
  reducer: 'EDIT/match',
  path: `match/${matchID}/vote`,
});
export const getMatchComments = (postID, sortby, xuser_id) => dispatchGet({
  reducer: 'comments',
  path: `match/${postID}/comments`,
  params: {
    sortby,
    xuser_id,
  },
  transform: parser.parseCommentsInPost,
});
export const createMatchComment = (matchID, {
  params,
  payload,
  payloadCallback,
  /**/
  reducer = 'ADD/comments',
  reducerCallback = 'EDIT_ARR/matches',
} = {}) => dispatchPost({
  reducer,
  reducerCallback,
  path: `match/${matchID}/comment`,
  params,
  payload,
  transform: parser.parseCommentAfterCommentInMatch,
  payloadCallback,
});

/**
 *
 * COMMUNITY
 *
 * */
export const setCommunity = payload => dispatch => dispatch(({
  type: 'OK/community',
  payload,
}));
export const getCommunity = communityID => dispatchGet({
  reducer: 'community',
  path: `community/${communityID}`,
  params: {},
  transform: parser.parseCommunityDetail,
});
export const getCommunityByLink = communityLink => dispatchGet({
  reducer: 'community',
  path: `community-link/${communityLink}`,
  params: {},
  transform: parser.parseCommunityDetail,
});
export const getSuggestedCommunities = () => dispatchGet({
  reducer: 'suggestedCommunities',
  path: 'communities/suggestion',
  transform: resp => resp.communities,
});

/**
 *
 * GROUP
 *
 * */
export const getGroupMemberships = groupID => dispatchGet({
  reducer: 'EDIT/community',
  path: `group/${groupID}/memberships`,
  transform: (resp) => {
    const { group_membership } = resp;
    if (group_membership && group_membership.length) {
      return {
        groupMemberships: group_membership[group_membership.length - 1],
      };
    }
    return null;
  },
});
export const getGroupMembershipPackages = gmID => dispatchGet({
  reducer: 'EDIT/community',
  path: `membership/${gmID}/packs`,
  transform: (resp) => {
    const { group_membership_packs } = resp;
    if (group_membership_packs && group_membership_packs.length) {
      return {
        groupMembershipPackages: group_membership_packs,
      };
    }
    return null;
  },
});


// league
export const getLeagueLastSeasons = (leagueID, callback) => dispatchGet({
  reducer: 'ADD/seasons',
  path: `league/${leagueID}/seasons`,
  params: {
    league_id: leagueID,
  },
  transform: (resp) => {
    const { seasons } = resp;
    if (seasons) {
      const last = seasons[seasons.length - 1];
      return seasons.filter(el => el.year === last.year);
    }
    return null;
  },
  callback,
});
export const getSeasonMatches = (seasonID, {
  start_time = parseInt(Date.now() / 1000), end_time = parseInt(Date.now() / 1000) + 2592000,
} = {}) => dispatchGet({
  reducer: 'ADD/matches',
  path: 'matches',
  params: {
    season_id: seasonID,
    start_time,
    end_time,
  },
  transform: parser.parseMatches,
});

// user
const changeFollow = (userID, {
  target_id,
  target_type,
  action_type,
  payload,
  /**/
  reducer = 'EDIT/metadata',
  path = `xuser/${userID}/change-follow`,
}) => dispatchPost({
  reducer,
  path,
  params: {
    target_id,
    target_type,
    action: action_type,
  },
  payload,
});
/* export const followUser = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'xuser',
  action_type: 'follow',
});
export const unfollowUser = (userID, targetID) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'xuser',
  action_type: 'unfollow',
}); */
export const followCommunity = (userID, targetID, payload) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'community',
  action_type: 'follow',
  payload,
});
export const unfollowCommunity = (userID, targetID, payload) => changeFollow(userID, {
  target_id: targetID,
  target_type: 'community',
  action_type: 'unfollow',
  payload,
});
const changeFollowTeam = (userID, {
  club_id, is_favorite,
  /**/
  reducer = 'EDIT/metadata', path = `xuser/${userID}/club`,
}) => dispatchPost({
  reducer, path, version: 'v1', params: { club_id, is_favorite, xuser_id: userID },
});
export const followTeam = (userID, teamID) => changeFollowTeam(userID, { club_id: teamID, is_favorite: true });
export const unfollowTeam = (userID, teamID) => changeFollowTeam(userID, { club_id: teamID, is_favorite: false });

/* games */

/**/
export const setSearchQuery = query => dispatch => dispatch(({
  type: 'QUERY/search',
  query,
}));
export const getSearchCommunities = query => dispatchGet({
  reducer: 'search',
  path: 'communities',
  params: {
    query,
  },
});
export const getSearchUsers = query => dispatchGet({
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
export const getBanner = (time = parseInt((Date.now() / 1000) - 86400, 10)) => dispatchGet({
  reducer: 'banner',
  path: 'banner',
  params: {
    time,
  },
  transform: resp => resp.banner,
});
export const getUpdateVersion = merged => dispatchGet({
  reducer: 'update',
  path: 'search/issues',
  params: {
    q: `repo:footballx/web type:pr base:production label:release merged:>${merged}`,
    order: 'desc',
    page: 1,
    per_page: 1,
  },
});

export * from './ajax';
export * from './dispatchForm';
export * from './dispatchData';
export * from './dispatchFirebase';
export * from './request';
