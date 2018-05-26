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
import { announce } from '../../actions';
import strings from '../../lang';
import Announce from '../Announce';
import Header from '../Header';
import { BurgerMenu } from '../BurgerMenu';
import * as Community from '../Community';
import * as Home from '../Home';
import * as Popular from '../Popular';
import { PageCreatePost, PageViewPost } from '../Post';
import * as Match from '../Match';
import { UpdateProfileStepper } from '../User';
import constants from '../constants';
import Login from '../Login';

const overwritesTheme = {
  fontFamily: constants.theme().fontFamily,
  card: { fontWeight: constants.fontWeightNormal },
  cardText: {
    color: constants.theme().textColorPrimary,
  },
  cardTitle: {

  },
  badge: { fontWeight: constants.fontWeightNormal },
  subheader: {
    fontWeight: constants.fontWeightNormal,
    color: constants.theme().textColorPrimary,
  },
  raisedButton: { fontWeight: constants.fontWeightNormal },
  flatButton: { fontWeight: constants.fontWeightNormal },
  inkBar: {
    backgroundColor: constants.colorBlue,
  },
  palette: {
    textColor: constants.theme().textColorPrimary,
    primary1Color: constants.colorBlue,
    canvasColor: constants.theme().surfaceColorPrimary,
    borderColor: constants.theme().dividerColor,
  },
  tabs: {
    backgroundColor: constants.theme().surfaceColorPrimary,
    textColor: constants.theme().textColorPrimary,
    selectedTextColor: constants.theme().textColorPrimary,
  },
  button: {
    height: 38,
    textTransform: 'none',
  },
  avatar: {
    backgroundColor: constants.theme().avatarBackgroundColor,
  },
};

const StyledDiv = styled.div`
  transition: ${constants.linearTransition};
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
    padding-left: ${props.trayWidth}px;
    //margin-left: auto;
    //margin-right: auto;
  `};
`;

const CONTENT = styled.div`
  display: inline;
  ${props => css`
    @media only screen and (min-width: ${props.trayWidth + 1200}px) {
      max-width: 1200px;
      //margin-left: auto;
      //margin-right: auto;
    }
  `}
  
  @media only screen and (max-width: 768px) {
    padding: 1em 0px;
  }
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
          { location.pathname !== '/popular' && this.props.user && <UpdateProfileStepper user={this.props.user} />}
          <BODY {...this.props} isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
            <Announce />
            <CONTENT isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
              <Route exact path="/" component={this.props.user ? Home.New : Popular.Hot} />
              <Route exact path="/popular" component={Popular.Hot} />
              <Route exact path="/sign_in" component={Login} />
              <Route exact path="/submit" component={PageCreatePost} />

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

              <Route exact path="/match" component={Match.Hot} />
              <Route exact path="/m/:id?/:info?/:subInfo?" component={Match.PageViewMatch} />
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
