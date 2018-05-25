import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionUpvote = props => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <path
      d="M8 32 L22 32 L22 56 L42 56 L42 32 L56 32 L32 6"
    />
  </SvgIcon>
);
ActionUpvote = pure(ActionUpvote);
ActionUpvote.displayName = 'ActionUpvote';
ActionUpvote.muiName = 'SvgIcon';

export default ActionUpvote;

