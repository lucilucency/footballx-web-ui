import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import { Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import localUI, { getTheme, skeleton, savedTheme } from '../../theme';
import { announce, setTheme } from '../../actions';
import strings from '../../lang';
import { Banner, OnFog } from '../Announce';
import Header from '../Header';
import { BurgerMenu } from '../BurgerMenu';
import Game from '../Game/Game';
import * as Community from '../Community';
import * as Home from '../Home';
import * as Popular from '../Popular';
import { PageCreatePost, PageViewPost } from '../Post';
import * as Match from '../Match';
import * as Matches from '../Matches';
import * as League from '../League';
import * as Team from '../Team';
import Login from '../Login';

const overwritesTheme = ui => ({
  avatar: {
    backgroundColor: ui.avatarBackgroundColor,
  },
  fontFamily: skeleton.fontFamilyPrimary,
  badge: { fontWeight: skeleton.fontWeightNormal },
  raisedButton: { fontWeight: skeleton.fontWeightNormal },
  subheader: {
    color: ui.textColorPrimary,
  },
  flatButton: { fontWeight: skeleton.fontWeightNormal },
  // inkBar: {
  //   backgroundColor: ui.linkColor,
  // },
  palette: {
    primary1Color: ui.positive1Color, /* app-bar, toggle:true */
    primary2Color: ui.positive2Color, /* weak!!! datePicker.selectColor, timePicker.selectColor */
    primary3Color: ui.positive3Color, /* toggle:false, slider:false */
    accent1Color: ui.accent1Color, /* tab-bar, :secondary, inkBar */
    // accent2Color: '', /* weak!!! toggle:false */
    // accent3Color: '', /* weak!!! table-header */
    textColor: ui.textColorPrimary,
    secondaryTextColor: ui.textColorVariant1,
    canvasColor: ui.surfaceColorPrimary,
    alternateTextColor: ui.surfaceColorPrimary,
    borderColor: ui.borderColor,
  },
  card: {
    fontWeight: skeleton.fontWeightNormal,
    subtitleColor: ui.textColorPrimary,
  },
  tableRow: {
    borderColor: ui.borderColorVariant1,
  },
  tableHeaderColumn: {
    height: 48,
  },
  checkbox: {
    checkedColor: ui.checkboxCheckedColor,
  },
  tabs: {
    backgroundColor: ui.surfaceColorPrimary,
    textColor: ui.textColorPrimary,
    selectedTextColor: ui.textColorPrimary,
  },
  toolbar: {
    color: ui.alternateTextColor,
    backgroundColor: ui.positive1Color,
  },
  button: {
    height: 38,
    textTransform: 'none',
  },
});

const BODY = styled.div`
  flex-grow: 1;
  margin-top: 56px;
  transition: 250ms all ease;
  ${props => props.isTrayOpen && css`
    @media only screen and (min-width: 662px) {
      padding-left: ${props.trayWidth}px;
    }
  `};
`;

const RouteContent = styled.div`
  display: inline;
  @media only screen and (max-width: 768px) {
    padding: 1em 0px;
  }
  ${props => props.trayWidth && css`
    @media only screen and (min-width: ${props.trayWidth + 1200}px) {
      max-width: 1200px;
    }
  `}
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      window.scrollTo(0, 0);
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.theme && this.props.theme && prevProps.theme.name !== this.props.theme.name) {
      return true;
    }
    const patt = new RegExp('/r');
    if (prevProps.location && prevProps.location.pathname && this.props.location && this.props.location.pathname) {
      if (patt.test(prevProps.location.pathname) && !patt.test(this.props.location.pathname)) {
        this.props.setTheme({ name: savedTheme });
        return true;
      }
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.refresh) {
      this.setState({ refresh: false }); // eslint-disable-line
    } else if (snapshot !== null) {
      this.setState({ refresh: true }); // eslint-disable-line
    }
  }

  render() {
    const {
      params,
      // width,
      location,
    } = this.props;
    const storedTheme = this.props.theme && getTheme(this.props.theme.name);
    const themeToUse = (storedTheme && storedTheme.data) || localUI;
    const { refresh } = this.state;

    if (refresh) {
      return null;
    }

    const wrapperStyle = {
      transition: skeleton.linearTransition,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '100vh',
      backgroundColor: themeToUse.backgroundColorPrimary,
      backgroundImage: themeToUse.backgroundImageColor,
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(baseTheme, overwritesTheme(themeToUse))}>
        <div style={wrapperStyle}>
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header params={params} location={location} />
          <BurgerMenu />
          <OnFog location={location} user={this.props.user} />
          <BODY {...this.props} isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
            <Banner location={location} />
            <RouteContent isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
              <Route exact path="/" component={this.props.user ? Home.Home : Popular.Popular} />
              <Route exact path="/popular" component={Popular.Popular} />
              <Route exact path="/sign_in" component={Login} />
              <Route exact path="/submit" component={PageCreatePost} />
              <Route exact path="/game" component={Game} />
              <Route exact path="/home/:info?" component={Home.Home} />
              <Route exact path="/popular/:info" component={Popular.Popular} />
              <Route exact path="/p/:id?/:info?/:subInfo?" component={PageViewPost} />
              <Route exact path="/r/:id/:info?/:subInfo?" component={Community.Home} />
              <Route exact path="/matches/:info?" component={Matches.Home} />
              <Route exact path="/m/:id?/:info?/:subInfo?" component={Match.MatchDetail} />

              <Route exact path="/l/:id/:info?/:subInfo?" component={League.LeageView} />
              <Route exact path="/t/:id/:info?/:subInfo?" component={Team.ViewTeam} />
              {/* <Route exact path="/l/:id/matches" component={League.Matches} /> */}
              {/* <Route exact path="/l/:id/table" component={League.Table} /> */}
            </RouteContent>
          </BODY>
          <Snackbar
            open={this.props.announcement.open}
            message={this.props.announcement.message}
            action={this.props.announcement.action}
            autoHideDuration={this.props.announcement.autoHideDuration}
            onActionClick={this.props.announcement.onActionClick}
            onRequestClose={() => {
              this.props.announce({ open: false });
            }}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  params: PropTypes.shape({}),
  width: PropTypes.number,
  location: PropTypes.object,
  tray: PropTypes.shape({
    width: PropTypes.number,
    show: PropTypes.bool,
  }),
  theme: PropTypes.object,
  setTheme: PropTypes.func,
  user: PropTypes.object,

  announcement: PropTypes.object,
  announce: PropTypes.func,
};

const mapStateToProps = state => ({
  tray: state.app.tray,
  theme: state.app.theme,
  user: state.app.metadata.data.user,
  announcement: state.app.announcement,
});

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
  setTheme: props => dispatch(setTheme(props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
