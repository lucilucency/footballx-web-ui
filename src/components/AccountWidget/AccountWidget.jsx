import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import strings from '../../lang';
import Spinner from '../Spinner';
import Error from '../Error';
import LoggedInUser from './LoggedInUser';

const IconButtonLink = styled.a`
  padding: 0 !important;
  height: auto !important;
  width: auto !important;
  vertical-align: middle;
  line-height: 56px;

  & svg:hover {
    opacity: 1;
  }

  &[data-hint-position="bottom"] {
    &::before {
      bottom: -9px;
      left: 8px;
    }

    &::after {
      margin-top: 9px;
    }
  }
`;

const Styled = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const AccountWidget = ({
  loading, error, user, style,
}) => (
  <Styled style={style}>
    {loading && !error && <Spinner size={20} />}
    {error && <Error />}
    {!error && !loading && user
      ? <LoggedInUser style={style} user={user} />
      :
      <IconButtonLink href="/sign_in">
        {strings.app_login}
      </IconButtonLink>
    }
  </Styled>
);

AccountWidget.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  user: PropTypes.shape({}),
  style: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { error, loading, data } = state.app.metadata;
  return {
    loading,
    error,
    user: data.user,
  };
};

function RequestLayer(props) {
  return <AccountWidget {...props} />;
}

export default connect(mapStateToProps, null)(RequestLayer);
