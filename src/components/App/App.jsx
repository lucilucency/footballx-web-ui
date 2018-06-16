import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import { Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import ui from '../../theme';
import { announce } from '../../actions';
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

const overwritesTheme = {
  fontFamily: ui.fontFamilyPrimary,
  card: { fontWeight: ui.fontWeightNormal },
  badge: { fontWeight: ui.fontWeightNormal },
  subheader: {
    // fontWeight: ui.fontWeightNormal,
    color: ui.textColorPrimary,
  },
  raisedButton: { fontWeight: ui.fontWeightNormal },
  flatButton: { fontWeight: ui.fontWeightNormal },
  inkBar: {
    backgroundColor: ui.linkColor,
  },
  palette: {
    textColor: ui.textColorPrimary,
    secondaryTextColor: ui.textColorVariant1,
    canvasColor: ui.surfaceColorPrimary,
    alternateTextColor: ui.surfaceColorPrimary,
    borderColor: ui.borderColor,
    primary1Color: ui.primary1Color, /* app-bar, toggle:true */
    // primary2Color: '', /* weak!!! datePicker.selectColor, timePicker.selectColor */
    // primary3Color: '', /* toggle:false, slider:false */
    // accent1Color: materialColor.green500, /* tab-bar, :secondary */
    // accent2Color: '', /* weak!!! toggle:false */
    // accent3Color: '', /* weak!!! table-header */
  },
  tableRow: {
    borderColor: ui.borderColorVariant1,
  },
  checkbox: {
    checkedColor: ui.checkboxCheckedColor || ui.primary1Color,
  },
  tabs: {
    backgroundColor: ui.surfaceColorPrimary,
    textColor: ui.textColorPrimary,
    selectedTextColor: ui.textColorPrimary,
  },
  button: {
    height: 38,
    textTransform: 'none',
  },
  avatar: {
    backgroundColor: ui.avatarBackgroundColor,
  },
};

const StyledDiv = styled.div`
  transition: ${ui.linearTransition};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  left: ${props => (props.open ? '256px' : '0px')};
`;

const BODY = styled.div`
   //padding: 25px;
  flex-grow: 1;
  margin-top: 56px;
  text-align: center;
  transition: 250ms all ease;
  ${props => props.isTrayOpen && css`
    @media only screen and (min-width: 662px) {
      padding-left: ${props.trayWidth}px;
      //margin-left: auto;
      //margin-right: auto;
    }
  `};
`;

const CONTENT = styled.div`
  display: inline;
  @media only screen and (max-width: 768px) {
    padding: 1em 0px;
  }
  ${props => css`
    @media only screen and (min-width: ${props.trayWidth + 1200}px) {
      max-width: 1200px;
      //margin-left: auto;
      //margin-right: auto;
    }
  `}
  
  
`;

class App extends React.Component {
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      params,
      // width,
      location,
    } = this.props;
    // const themeName = localStorage.getItem('theme') || 'light';
    // const theme = themeName === 'light' ? lightBaseTheme : darkBaseTheme;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(overwritesTheme)}>
        <StyledDiv {...this.props}>
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header params={params} location={location} />
          <BurgerMenu />
          <OnFog location={location} user={this.props.user} />
          <BODY {...this.props} isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
            <Banner location={location} />
            <CONTENT isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
              <Route exact path="/" component={this.props.user ? Home.New : Popular.Hot} />
              <Route exact path="/popular" component={Popular.Hot} />
              <Route exact path="/sign_in" component={Login} />
              <Route exact path="/submit" component={PageCreatePost} />

              <Route exact path="/game" component={Game} />

              <Route exact path="/new" component={Home.New} />
              <Route exact path="/hot" component={Home.Hot} />
              <Route exact path="/top" component={Home.Top} />
              <Route exact path="/controversy" component={Home.Controversy} />
              <Route exact path="/popular/new" component={Popular.New} />
              <Route exact path="/popular/hot" component={Popular.Hot} />
              <Route exact path="/popular/top" component={Popular.Top} />
              <Route exact path="/popular/controversy" component={Popular.Controversy} />
              <Route exact path="/p/:id?/:info?/:subInfo?" component={PageViewPost} />

              <Route exact path="/r/:id?" component={Community.Hot} />
              <Route exact path="/r/:id?/new" component={Community.New} />
              <Route exact path="/r/:id?/hot" component={Community.Hot} />
              <Route exact path="/r/:id?/top" component={Community.Top} />
              <Route exact path="/r/:id?/controversy" component={Community.Controversy} />

              <Route exact path="/matches/:info?" component={Matches.Home} />
              <Route exact path="/m/:id?/:info?/:subInfo?" component={Match.MatchDetail} />

              <Route exact path="/l/:id/:info?/:subInfo?" component={League.LeageView} />
              <Route exact path="/t/:id/:info?/:subInfo?" component={Team.ViewTeam} />
              {/* <Route exact path="/l/:id/matches" component={League.Matches} /> */}
              {/* <Route exact path="/l/:id/table" component={League.Table} /> */}
            </CONTENT>
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
        </StyledDiv>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  params: PropTypes.shape({}),
  width: PropTypes.number,
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
  tray: PropTypes.shape({
    width: PropTypes.number,
    show: PropTypes.bool,
  }),
  user: PropTypes.object,

  announcement: PropTypes.object,
  announce: PropTypes.func,
};

const mapStateToProps = state => ({
  tray: state.app.tray,
  user: state.app.metadata.data.user,
  announcement: state.app.announcement,
});

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
