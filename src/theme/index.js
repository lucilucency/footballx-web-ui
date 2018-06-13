/* eslint-disable global-require */
import * as materialColor from 'material-ui/styles/colors';
import constants from '../components/constants';

export const themes = [{
  value: 'light',
  native: 'Light',
  data: {
    ...constants,
    positiveColor: materialColor.green500,
    positiveColorVariant2: materialColor.green100,
    positiveColorVariant1: materialColor.green400,
    negativeColor: materialColor.red500,
    negativeColorVariant1: '#ff4c4c',
    negativeColorVariant2: '#FFAB40',
    disabledColor: materialColor.grey400,
    disabledColorVariant1: materialColor.grey400,
    neutralColor: materialColor.grey500,
    neutralColorVariant1: materialColor.grey300,
    linkColor: '#6BF',
    borderColor: 'rgb(224, 224, 224)',
    borderColorVariant1: materialColor.grey50,
    avatarBackgroundColor: materialColor.grey50,

    backgroundColorPrimary: materialColor.grey100,
    backgroundImageColor: '#eef2f5', /* root background-image */
    surfaceColorPrimary: materialColor.fullWhite,
    textColorPrimary: materialColor.grey900,
    textColorVariant1: materialColor.grey800,
    textColorVariant2: materialColor.grey700,
    // textColorVariant3: materialColor.grey600,
    // textColorVariant4: materialColor.grey500,

    primary1Color: '#249A23', /* header, app-bar, toggle:true */
    alternateTextColor: materialColor.fullWhite,
    alternateTextColorVariant1: materialColor.lightWhite,
  },
}, {
  value: 'red',
  native: 'Red',
  data: {
    ...constants,
    positiveColor: materialColor.red500,
    positiveColorVariant2: materialColor.red100,
    positiveColorVariant1: materialColor.red400,
    negativeColor: materialColor.red500,
    negativeColorVariant1: '#ff4c4c',
    negativeColorVariant2: '#FFAB40',
    disabledColor: materialColor.grey400,
    disabledColorVariant1: materialColor.grey400,
    neutralColor: materialColor.grey500,
    neutralColorVariant1: materialColor.grey300,
    linkColor: '#6BF',
    borderColor: 'rgb(224, 224, 224)',
    borderColorVariant1: materialColor.grey50,
    avatarBackgroundColor: materialColor.grey50,

    backgroundColorPrimary: materialColor.grey100, /* canvas color */
    backgroundImageColor: '#eef2f5', /* root background-image */
    surfaceColorPrimary: '#fff',
    textColorPrimary: materialColor.grey900,
    textColorVariant1: materialColor.grey800,
    textColorVariant2: materialColor.grey400,
    // textColorVariant3: materialColor.grey600,
    // textColorVariant4: materialColor.grey500,

    primary1Color: materialColor.red600, /* header, appBar,... */
    alternateTextColor: materialColor.fullWhite,
    alternateTextColorVariant1: materialColor.lightWhite,
  },
}, {
  value: 'dark',
  native: 'Dark',
  data: {
    ...constants,
    positiveColor: materialColor.redA700,
    positiveColorVariant1: materialColor.grey400,
    positiveColorVariant2: materialColor.grey100,
    negativeColor: materialColor.minBlack,
    negativeColorVariant1: '#ff4c4c',
    negativeColorVariant2: '#FFAB40',
    disabledColor: materialColor.grey400,
    disabledColorVariant1: materialColor.grey400,
    neutralColor: materialColor.grey500,
    neutralColorVariant1: materialColor.grey50,
    linkColor: '#6BF',
    borderColor: 'rgb(52, 50, 50)',
    borderColorVariant1: materialColor.grey50,
    avatarBackgroundColor: 'rgba(255, 255, 255, 0.1)',

    backgroundColorPrimary: '#2d2c43',
    backgroundImageColor: 'linear-gradient(135deg, rgb(46, 45, 69), rgb(28, 33, 39))',
    surfaceColorPrimary: 'rgb(46, 47, 64)',
    textColorPrimary: '#c6d4df',
    textColorVariant1: materialColor.grey800,
    textColorVariant2: materialColor.grey700,
    // textColorVariant3: materialColor.grey600,
    // textColorVariant4: materialColor.grey500,

    primary1Color: '#171a21', /* header, app-bar, toggle:true */
    alternateTextColor: '#b8b6b4',
    alternateTextColorVariant1: materialColor.lightWhite,

    checkboxCheckedColor: materialColor.cyan600,
  },
}].filter(Boolean);
const savedTheme = window.localStorage && window.localStorage.getItem('theme');
const themeToUse = (themes.filter(o => o).find(el => el.value === savedTheme) || themes[0]).data;
export default themeToUse;
