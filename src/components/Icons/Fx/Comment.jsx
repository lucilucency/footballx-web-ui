import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

// eslint-disable-next-line import/no-mutable-exports
let ActionComment = props => (
  <SvgIcon {...props} viewBox="0 0 25 19">
    <path d="M16.1457 5.23699L15.2251 4.67963L17.5267 1.09817L18.4474 1.65553L16.1457 5.23699ZM13.0427 -4.21023e-08H11.9573V4.2216H13.0427V-4.21023e-08ZM9.74085 4.67963L7.43919 1.09817L6.51853 1.66105L8.82019 5.24251L9.74085 4.67963ZM25 9.49721L16.1969 11.2907C16.3048 11.7157 16.3048 12.2399 16.3048 12.6648C16.3048 16.1469 13.3724 19 9.78063 19C6.74017 19 4.2396 16.9968 3.47806 14.3589C3.15413 14.5686 2.71653 14.7784 2.17095 14.7784C0.977495 14.7784 0 13.8292 0 12.6703C0 11.5114 0.977495 10.5623 2.17095 10.5623C2.71653 10.5623 3.14844 10.7719 3.47806 10.9817C4.2396 8.34386 6.74017 6.34067 9.78063 6.34067H10.8661V8.44871H14.1282V6.34067H24.9944V9.49721H25ZM3.26211 12.6648C3.26211 12.0302 2.82451 11.6108 2.17663 11.6108C1.52876 11.6108 1.09116 12.0302 1.09116 12.6648C1.09116 13.2994 1.52876 13.7188 2.17663 13.7188C2.82451 13.7188 3.26211 13.2994 3.26211 12.6648Z" transform="translate(25 -0.000183105) scale(-1 1)" fill="#828282" />
  </SvgIcon>
);
ActionComment = pure(ActionComment);
ActionComment.displayName = 'ActionComment';
ActionComment.muiName = 'SvgIcon';

export default ActionComment;

