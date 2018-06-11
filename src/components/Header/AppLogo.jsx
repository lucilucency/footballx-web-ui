import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import strings from '../../lang/index';
import ui from '../../theme/index';
import { LogoRound } from '../Icons/index';

const StyledLink = styled(Link)`
  font-weight: ${ui.fontWeightMedium};
  color: ${ui.textColorPrimary};
  text-transform: uppercase;
  //background-color: ${ui.backgroundColorPrimary};
  display: inline-flex;
  vertical-align: middle;
  
  &:hover {
    color: ${ui.textColorPrimary};
    opacity: 0.6;
  }
`;

const AppLogo = () => (
  <StyledLink to="/">
    {/* <span style={{ fontSize: size, verticalAlign: 'middle' }}>
      {strings.app_name}
    </span> */}
    <LogoRound />
  </StyledLink>
);

AppLogo.propTypes = {
  // size: PropTypes.number,
};

export default AppLogo;
