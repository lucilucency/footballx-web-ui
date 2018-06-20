import constants from '../components/constants';
import ThemePitch from './pitch';
import ThemeRed from './red';
import ThemeDark from './dark';

export const skeleton = constants;
export const themes = [{
  value: 'pitch',
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
export const getTheme = themeName => themes.find(el => el.value === themeName);
export const savedTheme = window.localStorage && window.localStorage.getItem('theme');
const themeToUse = (getTheme(savedTheme) || themes[0]).data;
export default themeToUse;
