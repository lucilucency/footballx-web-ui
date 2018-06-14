import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup } from 'material-ui';
import ActionSearch from 'material-ui/svg-icons/action/search';
import styled from 'styled-components';
import strings from '../../lang';
import ui from '../../theme';
import FastActions from './AccountWidget';
import SearchForm from '../Search/SearchForm';
import { BurgerButton } from '../BurgerMenu';
import UserSettings from './UserSettings';

const getHeaderLinks = () => [
  <Link key={strings.header_home} to="/">{strings.header_home}</Link>,
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  <Link key={strings.header_games} to="/game">{strings.header_games}</Link>,
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
  
  > div {
    margin: 0 1em;
    
    @media only screen and (max-width: 768px) {
      margin: 0 8px 0 0;
    } 
  }
`;

const HeaderStyled = styled(Toolbar)`
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-color: ${ui.primary1Color} !important;
  color: ${ui.alternateTextColor};
  font-family: ${ui.fontFamilyPrimary};
  
  @media only screen and (max-width: 768px) {
    font-size: ${ui.fontSizeLittle};
  } 
  
  padding: 8px !important;
  & a {
    color: ${ui.alternateTextColor};

    &:hover {
      color: ${ui.alternateTextColorVariant1};
    }
  }
`;

const HeaderLink = ({ user }) => (
  <VerticalAlignToolbar>
    {getHeaderLinks(user).map(Page => (
      <TabContainer key={Page.key}>
        <div style={{ textAlign: 'center', fontWeight: `${ui.fontWeightNormal} !important` }}>
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
    <ActionSearch style={{ marginRight: 6, opacity: '.6', color: ui.alternateTextColor }} />
    <SearchForm />
  </VerticalAlignToolbar>
);

const Header = ({ greaterThanSmall, user }) => (
  <HeaderStyled>
    <VerticalAlignDiv>
      <BurgerButton />
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
  greaterThanSmall: PropTypes.bool,
  user: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  user: state.app.metadata.data.user,
});
export default connect(mapStateToProps, null)(Header);
