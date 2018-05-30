import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import constants from '../constants';
// import strings from '../../lang/index';
import { FxPNG } from '../Icons/index';

const StyledLink = styled(Link)`
  font-weight: ${constants.fontWeightMedium};
  color: ${constants.theme().textColorPrimary};
  text-transform: uppercase;
  //background-color: ${constants.theme().backgroundColorPrimary};
  display: inline-flex;
  vertical-align: middle;
  
  &:hover {
    color: ${constants.theme().textColorPrimary};
    opacity: 0.6;
  }
`;

const AppLogo = () => (
  <StyledLink to="/">
    {/* <span style={{ fontSize: size, verticalAlign: 'middle' }}>
      {strings.app_name}
    </span> */}
    <FxPNG />
  </StyledLink>
);

AppLogo.propTypes = {
  // size: PropTypes.number,
};

export default AppLogo;
