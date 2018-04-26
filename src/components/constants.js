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
  fontSizeCommon: '16px',
  fontSizeMedium: '14px',
  fontSizeSmall: '12px',
  fontSizeTiny: '10px',
  normalTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  linearTransition: 'all 300ms linear',
  theme: () => {
    const themeName = localStorage.getItem('theme') || 'light';
    let theme = {};
    switch (themeName) {
      case 'dark':
        theme = {
          color: materialColor.black,
          lightColor: materialColor.lightBlack,
          darkColor: materialColor.darkBlack,
          almostColor: 'rgba(0, 0, 0, 0.9)',
          fullColor: materialColor.fullBlack,

          colorPrimary: 'rgba(0, 0, 0, 0.6)',
          colorSecondary: '#fff',
          textColorPrimary: '#F5F5F5',
          textColorSecondary: '#212020',

          backgroundColor: 'linear-gradient(135deg, #2e2d45, #1c2127)',
          surfaceColorPrimary: 'rgb(46, 47, 64)',
          surfaceColorSecondary: 'rgb(39, 39, 58)',
          dividerColor: 'rgb(52, 50, 50)',
          linkColorPrimary: '#6BF',

          fontFamily: `
          -apple-system, BlinkMacSystemFont,
          "Segoe UI",
          Roboto, "Droid Sans",
          Ubuntu, Cantarell,
          "Fira Sans",
          Helvetica, Arial, sans-serif`,
        };
        break;
      case 'light':
        theme = {
          color: materialColor.white,
          lightColor: materialColor.lightWhite,
          darkColor: materialColor.darkWhite,
          almostColor: '#fff',
          fullColor: materialColor.fullWhite,


          colorPrimary: '#fff',
          colorSecondary: '#fff',
          textColorPrimary: 'rgb(28, 28, 28)',
          textColorSecondary: '#F5F5F5',

          backgroundColor: '#eef2f5',
          surfaceColorPrimary: '#fff',
          surfaceColorSecondary: '#fff',
          dividerColor: 'rgb(52, 50, 50)',
          linkColorPrimary: '#6BF',

          fontFamily: `Noto Sans KR,Noto Sans,
          Helvetica,
          Arial,
          Malgun Gothic,
          sans-serif`,
        };
        break;
      default:
        theme = {
          color: materialColor.white,
          lightColor: materialColor.lightWhite,
          darkColor: materialColor.darkWhite,
          almostColor: '#fff',
          fullColor: materialColor.fullWhite,


          colorPrimary: '#fff',
          colorSecondary: '#fff',
          textColorPrimary: 'rgb(28, 28, 28)',
          textColorSecondary: '#F5F5F5',

          backgroundColor: '#eef2f5',
          surfaceColorPrimary: '#fff',
          surfaceColorSecondary: '#fff',
          dividerColor: 'rgb(52, 50, 50)',
          linkColorPrimary: '#6BF',

          fontFamily: `Noto Sans KR,Noto Sans,
          Helvetica,
          Arial,
          Malgun Gothic,
          sans-serif`,
        };
    }

    return theme;
  },
};

export default Constants;

