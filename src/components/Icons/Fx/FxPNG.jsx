import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Styled = styled.div`
  -moz-transition-duration: 250ms;
  -o-transition-duration: 250ms;
  -webkit-transition-duration: 250ms;
  transition-duration: 250ms;
  
  ${props => props.clicked && css`
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  `}
`;

const FxPNG = ({ clicked, style }) => (
  <Styled
    clicked={clicked}
    style={{
      ...style,
      // width: 40,
      // height: 40,
      minHeight: 24,
      verticalAlign: 'middle',
      background: 'url(/assets/images/icons/icon-48x48.png)',
      backgroundSize: '80%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColorPrimary: '#051433',
      borderRadius: '40px',
    }}
  />
);

FxPNG.propTypes = {
  clicked: PropTypes.bool,
  style: PropTypes.object,
};

export default FxPNG;
