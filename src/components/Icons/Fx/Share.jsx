import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionShare = props => (
  <SvgIcon {...props} viewBox="0 0 25 19">
    <path d="M20 8.38402L11.5314 -5.54686e-08V5.58381C5.16281 5.58381 0 10.695 0 17C2.33957 12.7781 6.98141 10.6012 11.5314 11.1592V16.768L20 8.38402Z" />
  </SvgIcon>
);
ActionShare = pure(ActionShare);
ActionShare.displayName = 'ActionShare';
ActionShare.muiName = 'SvgIcon';

export default ActionShare;

