import * as materialColor from 'material-ui/styles/colors';

const Constants = {
  ...materialColor,
  colorSuccess: '#66BB6A',
  colorDanger: '#ff4c4c',
  colorGreen: '#66BB6A',
  colorRed: '#ff4c4c',
  colorBlue: '#6BF',
  colorMuted: '#727272',
  colorYelor: '#FFAB40',
  colorGolden: '#e5c100',
  colorBlueGray: '#7c99a8',
  green: '#66BB6A',
  blue: '#6BF',
  golden: '#e5c100',
  yelor: '#FFAB40',
  red: '#ff4c4c',
  lightGray: 'rgb(179, 179, 179)',
  colorBlueMuted: 'rgba(102, 187, 255, 0.3)',
  colorYelorMuted: 'rgba(255, 171, 64, 0.3)',
  colorMutedLight: 'rgb(179, 179, 179)',

  fontWeightLight: '200',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightHeavy: '600',
  fontSizeHuge: '50px',
  fontSizeBig: '37px',
  fontSizeCommon: '21px',
  fontSizeMedium: '16px',
  fontSizeSmall: '14px',
  fontSizeTiny: '12px',
  lineHeightMedium: '21px',
  lineHeightSmall: '18px',
  normalTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  linearTransition: 'all 300ms linear',
  theme: () => {
    const themeName = localStorage.getItem('theme') || 'light';
    let theme = {};
    switch (themeName) {
      case 'dark':
        theme = {
          backgroundColor: '#2d2c43',
          surfaceColorPrimary: 'rgb(46, 47, 64)',
          textColorPrimary: 'rgb(245, 245, 245)',
          textColorPrimary1: '#222222',
          textColorPrimary2: '#555555',
          textColorPrimary3: '#777777',
          textColorPrimary4: '#999999',

          backgroundColorSecondary: 'linear-gradient(135deg, rgb(46, 45, 69), rgb(28, 33, 39))',
          surfaceColorSecondary: 'rgb(39, 39, 58)',
          textColorSecondary: '#212020',

          dividerColor: 'rgb(52, 50, 50)',
          linkColor: '#6BF',
          avatarBackgroundColor: 'rgba(255, 255, 255, 0.1)',
          buttonMute: materialColor.grey400,

          fontFamily: '"IBM Plex Sans", sans-serif',
          fontFamilySecondary: 'Open Sans',
        };
        break;
      case 'light':
        theme = {
          positiveColor: materialColor.greenA200,
          negativeColor: materialColor.redA200,
          neutralColor: materialColor.grey400,

          backgroundColor: '#F7F7F7',
          surfaceColorPrimary: '#fff',
          textColorPrimary: '#222222',
          textColorPrimary2: '#333333',
          textColorPrimary3: '#555555',
          textColorPrimary4: '#777777',
          textColorPrimary5: '#999999',

          backgroundColorSecondary: '#eef2f5', /* root background-image */
          surfaceColorSecondary: '#249A23', /* header */
          textColorSecondary: '#FFFFFF',
          textColorSecondary2: 'rgba(255, 255, 255, 0.6)',

          linkColor: '#6BF',
          dividerColor: 'rgb(224, 224, 224)',
          avatarBackgroundColor: materialColor.grey50,
          buttonMute: materialColor.grey400,

          // fontFamily: 'IBM Plex Sans',
          fontFamily: 'Noto Sans KR,Noto Sans,Helvetica,Arial,Malgun Gothic,sans-serif',
          fontFamilySecondary: 'Noto Sans KR,Noto Sans,Helvetica,Arial,Malgun Gothic,sans-serif',
          // fontFamilySecondary: 'Open Sans',
        };
        break;
      default:
        theme = {
          color: materialColor.white,
          lightColor: materialColor.lightWhite,
          darkColor: materialColor.darkWhite,
          almostColor: '#fff',
          fullColor: materialColor.fullWhite,

          textColorPrimary: '#333333',
          textColorSecondary: 'rgb(70, 68, 68)',

          backgroundColor: '#eef2f5',
          backgroundColorSecondary: '#eef2f5', /* root background-image */
          surfaceColorPrimary: '#fff',
          surfaceColorSecondary: '#fff', /* header */
          dividerColor: 'rgb(224, 224, 224)',
          linkColor: '#6BF',
          avatarBackgroundColor: materialColor.grey50,
          buttonMute: materialColor.grey400,

          fontFamily: '"IBM Plex Sans", sans-serif',
          fontFamilySecondary: 'Open Sans',
        };
    }

    return theme;
  },
};

export default Constants;

