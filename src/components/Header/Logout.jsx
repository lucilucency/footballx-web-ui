import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import strings from '../../lang';
import constants from '../constants';
import { eraseCookie } from '../../utils';

const LinkStyled = styled.a`
  font-size: ${constants.fontSizeNormal};
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
    eraseCookie('access_token');
    eraseCookie('user_id');
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
