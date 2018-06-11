/* eslint-disable global-require */
import * as materialColor from 'material-ui/styles/colors';
import constants from '../components/constants';

export const themes = [{
  value: 'light',
  native: 'Light Theme',
  data: {
    ...constants,
    positiveColor: materialColor.green500,
    positiveColorVariant1: materialColor.green100,
    positiveColorVariant2: '#66BB6A',
    negativeColor: materialColor.red500,
    negativeColorVariant1: '#ff4c4c',
    negativeColorVariant2: '#FFAB40',
    disabledColor: materialColor.grey400,
    disabledColorVariant1: 'rgb(179, 179, 179)',
    neutralColor: materialColor.grey500,
    neutralColorVariant1: materialColor.grey300,
    linkColor: '#6BF',
    borderColor: 'rgb(224, 224, 224)',
    borderColorVariant1: materialColor.grey50,
    avatarBackgroundColor: materialColor.grey50,

    backgroundColorPrimary: '#F7F7F7',
    surfaceColorPrimary: '#fff',
    textColorPrimary: '#222222',
    textColorPrimary2: '#333333',
    textColorPrimary3: '#555555',
    textColorPrimary4: '#777777',
    textColorPrimary5: '#999999',
    // primary1Color: '',
    // primary2Color: '',
    // primary3Color: '',
    // accent1Color: '',
    // accent2Color: '',
    // accent3Color: '',

    backgroundColorSecondary: '#eef2f5', /* root background-image */
    surfaceColorSecondary: '#249A23', /* header */
    textColorSecondary: '#FFFFFF',
    textColorSecondary2: 'rgba(255, 255, 255, 0.6)',
  },
}, null && {
  value: 'dark',
  native: 'Dark Theme',
  data: {
    ...constants,
    positiveColor: materialColor.green500,
    positiveColorVariant1: materialColor.green100,
    positiveColorVariant2: '#66BB6A',
    negativeColor: materialColor.red500,
    negativeColorVariant1: '#ff4c4c',
    negativeColorVariant2: '#FFAB40',
    disabledColor: materialColor.grey400,
    disabledColorVariant1: 'rgb(179, 179, 179)',
    neutralColor: materialColor.grey500,
    neutralColorVariant1: materialColor.grey50,
    linkColor: '#6BF',
    borderColor: 'rgb(52, 50, 50)',
    borderColorVariant1: materialColor.grey50,
    avatarBackgroundColor: 'rgba(255, 255, 255, 0.1)',

    backgroundColorPrimary: '#2d2c43',
    surfaceColorPrimary: 'rgb(46, 47, 64)',
    textColorPrimary: materialColor.fullWhite,
    textColorPrimary1: '#222222',
    textColorPrimary2: '#555555',
    textColorPrimary3: '#777777',
    textColorPrimary4: '#999999',

    backgroundColorSecondary: 'linear-gradient(135deg, rgb(46, 45, 69), rgb(28, 33, 39))',
    surfaceColorSecondary: 'rgb(39, 39, 58)',
    textColorSecondary: materialColor.grey200,
  },
}].filter(Boolean);
const savedTheme = window.localStorage && window.localStorage.getItem('theme');
const themeToUse = (themes.filter(o => o).find(el => el.value === savedTheme) || themes[0]).data;
export default themeToUse;
