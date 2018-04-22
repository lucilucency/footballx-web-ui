import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import strings from '../../lang';
import FBLoginButton from './FacebookLoginButton';
import { ButtonsDiv } from './Styled';

const Buttons = ({ user }) => (
  <ButtonsDiv>
    <div className="bottomButtons">
      <FBLoginButton />
    </div>
    {
      !user &&
      <div>
        <FlatButton
          label={<span className="label">{strings.home_sign_up_with_email}</span>}
          // icon={<IconSteam />}
          href="/users/sign_up/email"
          containerElement={<Link to="/users/sign_up/email">{strings.home_sign_up_with_email}</Link>}
        />
      </div>
    }
  </ButtonsDiv>
);

Buttons.propTypes = {
  user: PropTypes.shape({}),
};

const mapStateToProps = (state) => {
  const { data } = state.app.metadata;
  return {
    user: data.user,
  };
};

export default connect(mapStateToProps, null)(Buttons);
