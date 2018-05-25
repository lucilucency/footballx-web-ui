import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionDownvote = props => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <path xmlns="http://www.w3.org/2000/svg" d="M22 34 L8 34 L32 58 L56 34 L42 34 L42 8 L22 8" />
  </SvgIcon>
);
ActionDownvote = pure(ActionDownvote);
ActionDownvote.displayName = 'ActionDownvote';
ActionDownvote.muiName = 'SvgIcon';

export default ActionDownvote;

