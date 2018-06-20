import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconButton, Avatar } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionHome from 'material-ui/svg-icons/social/person';
import styled from 'styled-components';
import { IconFacebook } from '../Icons';
import strings from '../../lang';
import { LocalizationMenu } from '../Localization';
import Dropdown from '../Header/Dropdown';
import ui from '../../theme';
import Logout from './Logout';

const VerticalAlignDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LinkRouterStyled = styled(Link)`
  font-size: ${ui.fontSizeNormal};
  font-weight: ${ui.fontWeightLight};
  color: ${ui.textColorPrimary} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 8px;

    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;
const LinkStyled = styled.a`
  font-size: ${ui.fontSizeNormal};
  font-weight: ${ui.fontWeightLight};
  color: ${ui.textColorPrimary} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 8px;

    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

const UserSettings = ({ user }) => (
  <VerticalAlignDropdown
    Button={IconButton}
    buttonProps={{
      children: user.avatar ? <Avatar src={user.avatar} size={36} /> : <ActionSettings />,
    }}
  >
    {null && <LocalizationMenu />}
    <LinkRouterStyled to={`/u/${user.id}`}>
      <ActionHome color={ui.positive1Color} size={24} style={{ width: 24, height: 24 }} />
      <span>{strings.app_my_profile}</span>
    </LinkRouterStyled>
    <LinkStyled
      href="//facebook.com/groups/626461337693569"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconFacebook fill={ui.blue} size={14} />
      <span>{strings.app_join_us_fb}</span>
    </LinkStyled>
    {user ? <Logout /> : null}
  </VerticalAlignDropdown>
);

UserSettings.propTypes = {
  user: PropTypes.shape({}),
};

export default UserSettings;
