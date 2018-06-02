import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup } from 'material-ui';
import ActionSearch from 'material-ui/svg-icons/action/search';
import styled from 'styled-components';
import strings from '../../lang';
import constants from '../constants';
import FastActions from './AccountWidget';
import SearchForm from '../Search/SearchForm';
// import AppLogo from './AppLogo';
import { BurgerButton } from '../BurgerMenu';
import UserSettings from './UserSettings';

const getHeaderLinks = () => [
  <Link key={strings.header_home} to="/">{strings.header_home}</Link>,
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
].filter(Boolean);

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  > div {
    //padding-left: 1em;
    //padding-right: 1em;
  }
`;

const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderStyled = styled(Toolbar)`
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-color: ${constants.theme().surfaceColorSecondary} !important;
  color: ${constants.theme().textColorSecondary};
  font-family: ${constants.theme().fontFamily};  
  
  padding: 8px !important;
  & a {
    color: ${constants.theme().textColorSecondary};

    &:hover {
      color: ${constants.theme().textColorSecondary};
    }
  }
`;

const LogoGroup = () => (
  <VerticalAlignToolbar>
    <BurgerButton />
    {/* {greaterThanSmall && <AppLogo style={{ marginRight: 18 }} size={24} />} */}
  </VerticalAlignToolbar>
);
LogoGroup.propTypes = {
  // greaterThanSmall: PropTypes.bool,
};

const HeaderLink = ({ user }) => (
  <VerticalAlignToolbar>
    {getHeaderLinks(user).map(Page => (
      <TabContainer key={Page.key}>
        <div style={{ margin: '0 10px', textAlign: 'center', fontWeight: `${constants.fontWeightNormal} !important` }}>
          {Page}
        </div>
      </TabContainer>
    ))}
  </VerticalAlignToolbar>
);
HeaderLink.propTypes = {
  user: PropTypes.object,
};

const Search = () => (
  <VerticalAlignToolbar style={{ marginLeft: 20 }}>
    <ActionSearch style={{ marginRight: 6, opacity: '.6', color: constants.theme().textColorSecondary }} />
    <SearchForm />
  </VerticalAlignToolbar>
);

const Header = ({ location, greaterThanSmall, user }) => (
  <HeaderStyled>
    <VerticalAlignDiv>
      <LogoGroup greaterThanSmall={greaterThanSmall} location={location} />
      <HeaderLink user={user} />
      {greaterThanSmall && <Search />}
    </VerticalAlignDiv>
    <VerticalAlignDiv >
      <FastActions greaterThanSmall={greaterThanSmall} />
      {user && <UserSettings user={user} />}
    </VerticalAlignDiv>
  </HeaderStyled>
);

Header.propTypes = {
  location: PropTypes.shape({}),
  greaterThanSmall: PropTypes.bool,

  user: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  user: state.app.metadata.data.user,
});
export default connect(mapStateToProps, null)(Header);
