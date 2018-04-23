import * as materialColor from 'material-ui/styles/colors';

const Constants = {
  ...materialColor,
  defaultPrimaryColor: 'rgba(0, 0, 0, 0.4)',
  darkPrimaryColor: 'rgba(0, 0, 0, 0.6)',
  almostBlack: 'rgba(0, 0, 0, 0.9)',
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
  primaryLinkColor: '#6BF',
  textColorPrimary: '#F5F5F5',
  textColorSecondary: '#212020',
  primarySurfaceColor: 'rgb(46, 47, 64)',
  surfaceColorSecondary: 'rgb(39, 39, 58)',
  tableHeaderSurfaceColor: 'rgba(0, 0, 0, .3)',
  tableRowOddSurfaceColor: 'rgba(255, 255, 255, .019)',
  tableRowEvenSurfaceColor: 'rgba(0, 0, 0, .019)',
  colorDivine: 'rgba(33, 41, 69, 0.45)',
  colorDivineAlt: 'rgba(33, 41, 69, 0.65)',
  colorAncient: 'rgba(82, 52, 91, 0.45)',
  colorAncientAlt: 'rgba(82, 52, 91, 0.65)',
  colorLegend: 'rgba(84, 60, 26, 0.45)',
  colorLegendAlt: 'rgba(84, 60, 26, 0.65)',
  colorArchon: 'rgba(24, 85, 74, 0.45)',
  colorArchonAlt: 'rgba(24, 85, 74, 0.65)',
  colorCrusader: 'rgba(58, 73, 124, 0.45)',
  colorCrusaderAlt: 'rgba(58, 73, 124, 0.65)',
  colorGuardian: 'rgba(114, 79, 49, 0.45)',
  colorGuardianAlt: 'rgba(114, 79, 49, 0.65)',
  colorHerald: 'rgba(32, 74, 33, 0.45)',
  colorHeraldAlt: 'rgba(32, 74, 33, 0.65)',
  sliderTicksColor: '#757575',
  sliderTicksColorActive: '#337AB7',
  dividerColor: 'rgb(52, 50, 50)',
  fontFamily: `
      -apple-system, BlinkMacSystemFont,
      "Segoe UI",
      Roboto, "Droid Sans",
      Ubuntu, Cantarell,
      "Fira Sans",
      Helvetica, Arial, sans-serif`,
  fontWeightLight: '200',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontSizeCommon: '16px',
  fontSizeMedium: '14px',
  fontSizeSmall: '12px',
  fontSizeTiny: '10px',
  navDrawerWidth: '256px',
  normalTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  linearTransition: 'all 300ms linear',
  theme: () => {
    const themeName = localStorage.getItem('theme') || 'white';
    let theme = {};
    switch (themeName) {
      case 'black':
        theme = {
          color: materialColor.black,
          lightColor: materialColor.lightBlack,
          darkColor: materialColor.darkBlack,
          almostColor: 'rgba(0, 0, 0, 0.9)',
          fullColor: materialColor.fullBlack,
          backgroundColor: 'linear-gradient(135deg, #2e2d45, #1c2127)',

          colorPrimary: 'rgba(0, 0, 0, 0.6)',
          colorSecondary: '#fff',
          textColorPrimary: '#F5F5F5',
          textColorSecondary: '#212020',
          surfaceColorPrimary: 'rgb(46, 47, 64)',
          surfaceColorSecondary: 'rgb(39, 39, 58)',
        };
        break;
      case 'white':
        theme = {
          color: materialColor.white,
          lightColor: materialColor.lightWhite,
          darkColor: materialColor.darkWhite,
          almostColor: 'rgba(0, 0, 0, 0.9)',
          fullColor: materialColor.fullWhite,
          backgroundColor: '#fafafa',

          colorPrimary: '#fff',
          colorSecondary: 'rgba(0, 0, 0, 0.6)',
          textColorPrimary: '#1f2629',
          textColorSecondary: '#F5F5F5',
          primarySurfaceColor: 'rgb(46, 47, 64)',
          surfaceColorSecondary: 'rgb(39, 39, 58)',

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
          almostColor: 'rgba(0, 0, 0, 0.9)',
          fullColor: materialColor.fullWhite,
          backgroundColor: materialColor.white,

          colorPrimary: '#fff',
          colorSecondary: 'rgba(0, 0, 0, 0.6)',
          textColorPrimary: '#1f2629',
          textColorSecondary: '#F5F5F5',
          primarySurfaceColor: 'rgb(46, 47, 64)',
          surfaceColorSecondary: 'rgb(39, 39, 58)',
        };
    }

    return theme;
  },
};

export default Constants;

