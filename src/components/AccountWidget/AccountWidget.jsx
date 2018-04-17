import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import Error from '../Error';
import LoggedIn from './LoggedIn';

const AccountWidget = ({
  loading, error, user, style,
}) => (
  <div style={style}>
    {loading && !error && <Spinner />}
    {error && <Error />}
    {!error && !loading && user
      ? <LoggedIn style={style} playerId={user.account_id} />
      :
      null
    }
  </div>
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
