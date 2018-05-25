import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionFollowCommunity = props => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#CECECE" />
    <path d="M0 0V12" transform="translate(12 6)" stroke="#CECECE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 0H12" transform="translate(6 12)" stroke="#CECECE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </SvgIcon>
);
ActionFollowCommunity = pure(ActionFollowCommunity);
ActionFollowCommunity.displayName = 'ActionFollowCommunity';
ActionFollowCommunity.muiName = 'SvgIcon';

export default ActionFollowCommunity;

