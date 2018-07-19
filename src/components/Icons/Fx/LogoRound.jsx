import React from 'react';
import PropTypes from 'prop-types';

const LogoRound = ({ clicked, style }) => {
  let style2 = {
    MozTransitionDuration: '250ms',
    OTransitionDuration: '250ms',
    WebkitTransitionDuration: '250ms',
    transitionDuration: '250ms',
    minHeight: 24,
    verticalAlign: 'middle',
    background: 'url(/assets/images/icons/icon-48x48.png)',
    backgroundSize: '80%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#051433',
    borderRadius: '40px',
  };
  if (clicked) {
    style2 = {
      ...style2,
      MozTransform: 'rotate(360deg)',
      MsTransform: 'rotate(360deg)',
      WebkitTransform: 'rotate(360deg)',
      transform: 'rotate(360deg)',
    };
  }

  return (
    <div
      style={{ ...style2, ...style }}
    />
  );
};

LogoRound.propTypes = {
  clicked: PropTypes.bool,
  style: PropTypes.object,
};

export default LogoRound;
