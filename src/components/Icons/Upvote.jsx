import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionUpvote = props => (
  <SvgIcon {...props}>
    <path
      d="M9.951908,4.166667H9.951867l-5.36036,5.825781C4.593775,9.997617,4.592553,9.994831,4.594821,10h3.321361
      c0.000668,0.000668,0.001042,0.001041,0.001709,0.001709V15h4.166667v-4.99648c0.001369-0.001369,0.002151-0.002151,0.00352-0.00352
      h3.329831L9.951908,4.166667z"
    />
  </SvgIcon>
);
ActionUpvote = pure(ActionUpvote);
ActionUpvote.displayName = 'ActionUpvote';
ActionUpvote.muiName = 'SvgIcon';

export default ActionUpvote;

