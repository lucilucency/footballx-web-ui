import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import Bug from 'material-ui/svg-icons/action/bug-report';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import styled from 'styled-components';
import strings from '../../lang';
import { LocalizationMenu } from '../Localization';
import Dropdown from '../Header/Dropdown';
import Announce from '../Announce';
import constants from '../constants';
import AccountWidget from '../AccountWidget';
import SearchForm from '../Search/SearchForm';
import AppLogo from '../App/AppLogo';
import BurgerMenu from './BurgerMenu';

const headerLinks = [
  <Link key={strings.header_home} to="/home">{strings.header_home}</Link>,
  //<Link key={strings.header_popular} to="/popular">{strings.header_popular}</Link>,
  //<Link key={strings.header_all} to="/all">{strings.header_all}</Link>,
  //<Link key={strings.header_explorer} to="/explorer">{strings.header_explorer}</Link>,
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
];

const burgerLinks = [];

const buttonProps = {
  children: <ActionSettings />,
};

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ToolbarHeader = styled(Toolbar)`
  background-color: ${constants.theme().colorPrimary} !important;
  padding: 8px !important;
  & a {
    color: ${constants.theme().textColorPrimary};

    &:hover {
      color: ${constants.theme().textColorPrimary};
      opacity: 0.6;
    }
  }
`;

const LinkStyled = styled.a`
  font-size: ${constants.fontSizeMedium};
  font-weight: ${constants.fontWeightLight};
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 5px;

    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

const LogoGroup = ({ greaterThanSmall }) => (
  <VerticalAlignToolbar>
    <BurgerMenu menuItems={burgerLinks} greaterThanSmall={greaterThanSmall} />
    <AppLogo style={{ marginRight: 18 }} />
  </VerticalAlignToolbar>
);

LogoGroup.propTypes = {
  greaterThanSmall: PropTypes.bool,
};

const LinkGroup = () => (
  <VerticalAlignToolbar>
    {headerLinks.map(Page => (
      <TabContainer key={Page.key}>
        <div style={{ margin: '0 10px', textAlign: 'center', fontWeight: `${constants.fontWeightNormal} !important` }}>
          {Page}
        </div>
      </TabContainer>
    ))}
  </VerticalAlignToolbar>
);

const SearchGroup = () => (
  <VerticalAlignToolbar style={{ marginLeft: 20 }}>
    <ActionSearch style={{ marginRight: 6, opacity: '.6' }} />
    <SearchForm />
  </VerticalAlignToolbar>
);

const AccountGroup = () => (
  <VerticalAlignToolbar>
    <AccountWidget />
  </VerticalAlignToolbar>
);

const LinkContributor = () => (
  <LinkStyled
    href="//facebook.com/groups/626461337693569"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Bug />
    <span>
      {strings.app_contribute}
    </span>
  </LinkStyled>
);

const LogOut = () => (
  <LinkStyled
    href={`${process.env.REACT_APP_API_HOST}/logout`}
    rel="noopener noreferrer"
  >
    <LogOutButton />
    <span>
      {strings.app_logout}
    </span>
  </LinkStyled>
);

const SettingsGroup = ({ user }) => (
  <VerticalAlignDropdown
    Button={IconButton}
    buttonProps={buttonProps}
  >
    <LocalizationMenu />
    <LinkContributor />
    {user ? <LogOut /> : null}
  </VerticalAlignDropdown>
);

SettingsGroup.propTypes = {
  user: PropTypes.shape({}),
};

const Header = ({ location, greaterThanSmall, user }) => (
  <div>
    <ToolbarHeader>
      <VerticalAlignDiv>
        <LogoGroup greaterThanSmall={greaterThanSmall} />
        {greaterThanSmall && <LinkGroup />}
        {greaterThanSmall && <SearchGroup />}
      </VerticalAlignDiv>
      <VerticalAlignDiv >
        {greaterThanSmall && <AccountGroup />}
        {<SettingsGroup user={user} />}
      </VerticalAlignDiv>
    </ToolbarHeader>
    { location.pathname !== '/' && <Announce /> }
  </div>
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
