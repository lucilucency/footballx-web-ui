import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import strings from '../../../lang/index';
import Spinner from '../../Spinner/index';
import Error from '../../Error/index';
import LoggedInUser from './LoggedInUser';

const IconButtonLink = styled(Link)`
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
  loading, user, style, greaterThanSmall,
}) => {
  const renderUser = () => {
    if (!user) {
      if (!loading) {
        return (
          <IconButtonLink to="/sign_in">
            {strings.app_login}
          </IconButtonLink>
        );
      } else if (loading) {
        return <Spinner size={20} />;
      }
    }

    if (loading) {
      return <Spinner size={20} />;
    }

    if (greaterThanSmall) {
      return <LoggedInUser style={style} user={user} greaterThanSmall={greaterThanSmall} />;
    }

    return null;
  };

  return (
    <Styled style={style}>
      {renderUser()}
    </Styled>
  );
};

AccountWidget.propTypes = {
  loading: PropTypes.bool,
  // error: PropTypes.string,
  user: PropTypes.shape({}),
  style: PropTypes.string,
  greaterThanSmall: PropTypes.bool,
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
