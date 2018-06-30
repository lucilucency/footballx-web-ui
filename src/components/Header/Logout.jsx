import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import strings from '../../lang';
import ui from '../../theme';
import { eraseCookie } from '../../utils';

const LinkStyled = styled.a`
  font-size: ${ui.fontSizeNormal};
  font-weight: ${ui.fontWeightLight};
  color: ${ui.textColorPrimary} !important;
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
  handleClickLogout = (event) => {
    event.preventDefault();
    eraseCookie('access_token');
    eraseCookie('user_id');
    eraseCookie('username');
    window.location.reload();
  };

  constructor() {
    super();
    this.state = {};
    // this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  render() {
    return (
      <LinkStyled
        onClick={e => this.handleClickLogout(e)}
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
