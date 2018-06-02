import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-mutable-exports
let LiveTV = props => (
  <SvgIcon {...props} viewBox="0 0 18 16">
    <path xmlns="http://www.w3.org/2000/svg" d="M6 42 C6 48 6 52 12 52 L52 52 C58 52 58 48 58 42 L58 26 C58 20 58 16 52 16 L34 16 L44 8 L32 16 L20 8 L30 16 T12 16 C6 16 6 20 6 26" />
    <path d="M14.4 0H1.6C0.716344 0 0 0.626801 0 1.4V9.1C0 9.8732 0.716344 10.5 1.6 10.5H14.4C15.2837 10.5 16 9.8732 16 9.1V1.4C16 0.626801 15.2837 0 14.4 0Z" transform="translate(1 4.5)" stroke={props.borderColor || '#828282'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 0L4 3.5L0 0" transform="translate(5 1)" stroke={props.borderColor || '#828282'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </SvgIcon>
);
LiveTV = pure(LiveTV);
LiveTV.displayName = 'LiveTV';
LiveTV.muiName = 'SvgIcon';
LiveTV.propTypes = {
  borderColor: PropTypes.string,
};

export default LiveTV;

