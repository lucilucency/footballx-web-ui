import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';
import strings from '../../lang';
import Spinner from '../Spinner';

const StyledFlatButton = styled(FlatButton)`
 min-width: 30px !important;
 & > div > span {
   display: inline-block;
   max-width: 200px;
   overflow: hidden;
   text-overflow: ellipsis;
   text-transform: none !important;
   white-space: nowrap;
   font-size: 16px !important;
   padding-right: 10px !important;
   padding-left: 0 !important;
 }
`;

const LoggedInUser = ({ user, style }) => {
  return (
    <Link style={style} to={`/user/${user.id}`}>
      <StyledFlatButton
        label={user.fullname || user.nickname || strings.app_my_profile}
        hoverColor="transparent"
      />
    </Link>
  );
};

LoggedInUser.propTypes = {
  style: PropTypes.shape({}),
  user: PropTypes.shape({}),
};

export default connect()(LoggedInUser);
