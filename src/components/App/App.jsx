import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import { Route } from 'react-router-dom';
import strings from '../../lang';
import Announce from '../Announce';
import Home from '../Home';
import Posts from '../Posts';
import Header from '../Header';
// import Footer from '../Footer';
import constants from '../constants';
import Login from '../Login';

const muiTheme = {
  fontFamily: constants.theme().fontFamily,
  card: { fontWeight: constants.fontWeightNormal },
  badge: { fontWeight: constants.fontWeightNormal },
  subheader: { fontWeight: constants.fontWeightNormal },
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
  button: { height: 38 },
};

const StyledDiv = styled.div`
  transition: ${constants.linearTransition};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  left: ${props => (props.open ? '256px' : '0px')};
  background-image: ${props => (props.location.pathname === '/' ? 'url("/assets/images/home-background.png")' : '')};
  background-position: ${props => (props.location.pathname === '/' ? 'center top' : '')};
  background-repeat: ${props => (props.location.pathname === '/' ? 'no-repeat' : '')};
  background-size: cover;
`;

const StyledBodyDiv = styled.div`
  padding: 25px;
  flex-grow: 1;
  margin-top: 56px;
  ${props => props.isTrayOpen && css`
    padding-left: ${props.trayWidth + 25}px;
  `};
  
  @media only screen and (min-width: 1200px) {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const AdBannerDiv = styled.div`
  text-align: center;

  & img {
    margin-top: 10px;
    max-width: 100%;
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
    const themeName = localStorage.getItem('theme') || 'light';
    const theme = themeName === 'light' ? lightBaseTheme : darkBaseTheme;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme, muiTheme)}>
        <StyledDiv {...this.props}>
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header params={params} location={location} />
          {false &&
          <AdBannerDiv>
            { location.pathname !== '/' &&
            <a href="http://www.vpgame.com/?lang=en_us">
              <img src="/assets/images/vp-banner.jpg" alt="" />
            </a>
            }
          </AdBannerDiv>
          }
          <StyledBodyDiv {...this.props} isTrayOpen={this.props.tray.show} trayWidth={this.props.tray.width}>
            { location.pathname !== '/' && <Announce /> }
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Posts} />
            <Route exact path="/hot" component={Posts} />
            <Route exact path="/sign_in" component={Login} />
          </StyledBodyDiv>
          {/* <Footer location={location} width={width} /> */}
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
};

const mapStateToProps = state => ({
  tray: state.app.tray,
});

export default connect(mapStateToProps)(App);
