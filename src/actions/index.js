import { dispatchPost, dispatchGet, dispatchAuth } from './dispatchAction';

export const getMetadata = (params = {}) => (dispatch) => {
  const getDataStart = payload => ({
    type: 'OK/metadata',
    payload,
  });

  const accessToken = params.access_token || localStorage.getItem('access_token');
  const accountUser = params.account_user || JSON.parse(localStorage.getItem('account_user'));
  const accountHotspot = params.account_hotspot || JSON.parse(localStorage.getItem('account_hotspot'));
  let payload = {};
  if (accessToken && accountUser) {
    payload = { user: accountUser, access_token: accessToken, hotspot: accountHotspot };
  }
  dispatch(getDataStart(payload));
};

// auth
export const login = (username, password) => dispatchAuth('auth', 'user/login', { username, password });

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
