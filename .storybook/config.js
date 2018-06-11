import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './styles.css';

import ui from '../src/theme';

const muiTheme = {
  fontFamily: ui.fontFamily,
  card: { fontWeight: ui.fontWeightNormal },
  badge: { fontWeight: ui.fontWeightNormal },
  subheader: { fontWeight: ui.fontWeightNormal },
  raisedButton: { fontWeight: ui.fontWeightNormal },
  flatButton: { fontWeight: ui.fontWeightNormal },
  inkBar: {
    backgroundColor: ui.linkColor,
  },
  palette: {
    textColor: ui.textColorPrimary,
    primary1Color: ui.linkColor,
    canvasColor: ui.surfaceColorPrimary,
  },
  tabs: {
    backgroundColor: ui.surfaceColorPrimary,
    textColor: ui.textColorPrimary,
    selectedTextColor: ui.textColorPrimary,
  },
  button: { height: 38 },
};

addDecorator(story =>
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
    {story()}
  </MuiThemeProvider>
);

function loadStories() {
  require('../src/stories/index');
}

configure(loadStories, module);
