import { dispatchPost, dispatchGet } from './dispatchAction';

export const getMetadata = (params = {}) => (dispatch) => {
  const getDataStart = payload => ({
    type: 'OK/metadata',
    payload,
  });

  const accessToken = params.access_token || localStorage.getItem('access_token');
  const userID = params.user_id || JSON.parse(localStorage.getItem('user_id'));
  let payload = {};
  if (accessToken && userID) {
    payload = { user: userID, access_token: accessToken };
  }
  dispatch(getDataStart(payload));
};

// auth
// export const login = (username, password) => dispatchAuth('auth', 'user/login', { username, password });
export const loginFb = access_token => dispatchPost('metadata', 'xuser/auth', { access_token });
export const refresh = userID => dispatchGet('metadata', `xuser/${userID}/refesh`, { xuser_id: userID });

export const getPosts = sortby => dispatchGet('posts', 'posts', { sortby });

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
