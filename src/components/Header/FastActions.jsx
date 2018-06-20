import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FlatButton, IconButton, RaisedButton } from 'material-ui';
import IconCreatePost from 'material-ui/svg-icons/editor/border-color';
import ui from '../../theme';
import strings from '../../lang/index';
import Spinner from '../Spinner/index';

const StyledFlatButton = styled(FlatButton)`
 min-width: 30px !important;
 & > div > span {
   display: inline-block;
   max-width: 200px;
   overflow: hidden;
   text-overflow: ellipsis;
   text-transform: none !important;
   white-space: nowrap;
   font-size: ${ui.fontSizeLarge} !important;
   padding-right: 0 !important;
   padding-left: 0 !important;
 }
`;

const LoggedInUser = ({ user, style }) => (
  <Link style={style} to={`/user/${user.id}`}>
    <StyledFlatButton
      label={user.username || user.nickname || strings.app_my_profile}
      hoverColor="transparent"
    />
  </Link>
);

LoggedInUser.propTypes = {
  user: PropTypes.object,
  style: PropTypes.object,
};

// const IconButtonLink = styled(Link)`
//   padding: 0 !important;
//   height: auto !important;
//   width: auto !important;
//   vertical-align: middle;
//   line-height: 56px;
//
//   & svg:hover {
//     opacity: 1;
//   }
//
//   &[data-hint-position="bottom"] {
//     &::before {
//       bottom: -9px;
//       left: 8px;
//     }
//
//     &::after {
//       margin-top: 9px;
//     }
//   }
// `;

const Button = styled.div`
  cursor: pointer;
  padding: 0 !important;
  height: auto !important;
  width: auto !important;
  vertical-align: middle;
  line-height: 56px;

  & svg:hover {
    opacity: 1;
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
          <Button
            onClick={() => {
              localStorage.setItem('previousPage', window.location.pathname);
              window.location.href = '/sign_in';
            }}
          >
            {strings.app_login}
          </Button>
        );
      } else if (loading) {
        return <Spinner size={20} />;
      }
    }

    if (loading) {
      return <Spinner size={20} />;
    }

    if (greaterThanSmall) {
      return (
        <Link to="/submit">
          <RaisedButton
            labelStyle={{ color: ui.alternateTextColor, fontSize: '14px' }}
            style={{ marginRight: 10, border: '1px solid', borderColor: ui.alternateTextColor }}
            buttonStyle={{ height: '32px', lineHeight: '32px' }}
            label="CREATE POST"
            backgroundColor={ui.positive1Color}
          />
        </Link>
      );
    }

    return (
      <Link style={style} to="/submit">
        <IconButton iconStyle={{ width: 20, height: 20 }}>
          <IconCreatePost />
        </IconButton>
      </Link>
    );
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

export default connect(mapStateToProps, null)(AccountWidget);
