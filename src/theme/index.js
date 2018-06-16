import constants from '../components/constants';
import ThemePitch from './pitch';
import ThemeRed from './red';
import ThemeDark from './dark';

export const themes = [{
  value: 'ThemePitch',
  native: 'Pitch',
  data: {
    ...constants,
    ...ThemePitch,
  },
}, {
  value: 'red',
  native: 'Red',
  data: {
    ...constants,
    ...ThemeRed,
  },
}, {
  value: 'dark',
  native: 'Dark',
  data: {
    ...constants,
    ...ThemeDark,
  },
}].filter(Boolean);
const savedTheme = window.localStorage && window.localStorage.getItem('theme');
const themeToUse = (themes.filter(o => o).find(el => el.value === savedTheme) || themes[0]).data;
export default themeToUse;
