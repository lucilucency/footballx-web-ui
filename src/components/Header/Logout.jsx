import React from 'react';
import { withRouter } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import styled from 'styled-components';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import strings from '../../lang';
import constants from '../constants';

const LogoutButton = styled(FlatButton)`
  font-size: ${constants.fontSizeMedium} !important;
  font-weight: ${constants.fontWeightLight} !important;
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 5px;

    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
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

class Logout extends React.Component {
  static handleClickLogout(event) {
    event.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('account_user');
    localStorage.removeItem('user_id');
    window.location.href = '/';
  }

  constructor() {
    super();
    this.state = {};
    // this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  render() {
    return (
      <LinkStyled
        onClick={e => Logout.handleClickLogout(e)}
        rel="noopener noreferrer"
      >
        <LogOutButton />
        <span>
          {strings.app_logout}
        </span>
      </LinkStyled>
    );
  }
}

export default withRouter(Logout);
