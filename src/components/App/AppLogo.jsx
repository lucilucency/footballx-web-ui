import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import constants from '../constants';
import strings from '../../lang';
import { IconFootballX } from '../Icons';

const StyledLink = styled(Link)`
  font-weight: ${constants.fontWeightMedium};
  color: ${constants.theme().textColorPrimary};
  text-transform: uppercase;
  //background-color: ${constants.theme().backgroundColor};
  display: inline-block;
  vertical-align: middle;
  
  &:hover {
    color: ${constants.theme().textColorPrimary};
    opacity: 0.6;
  }
`;

const AppLogo = ({ size }) => (
  <StyledLink to="/">
    <span style={{ fontSize: size, verticalAlign: 'middle' }}>
      {strings.app_name}
    </span>
    <IconFootballX
      style={{
        width: 1.45 * size,
        height: 1.5 * size,
        verticalAlign: 'middle',
        backgroundColor: 'transparent',
        borderRadius: 1.5 * size,
      }}
    />
  </StyledLink>
);

AppLogo.propTypes = {
  size: PropTypes.number,
};

export default AppLogo;
