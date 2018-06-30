import React from 'react';
import PropTypes from 'prop-types';
import { FacebookLogin } from 'react-facebook-login-component';
import styled from 'styled-components';

const Styled = styled(FacebookLogin)`
  background: #4267b2;
  border-radius: 5px;
  color: white;
  height: 40px;
  text-align: center;
  width: 250px;
  margin: auto;
  line-height: 40px;
`;

class FacebookLoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.onSuccess = this.props.onSuccess || (() => {});
    this.onFailure = this.props.onFailure || (() => {});
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  responseFacebook(response) {
    if (response) {
      const { accessToken } = response;
      this.onSuccess(accessToken, this.props.afterLogin);
    } else {
      this.onFailure(response);
    }
  }

  render() {
    return (
      <Styled
        socialId="1800262673561624"
        language="en_US"
        scope="public_profile,email,user_birthday,user_gender"
        responseHandler={this.responseFacebook}
        xfbml
        fields="id,email,name"
        version="v2.5"
        className="facebook-login"
        buttonText="Login With Facebook"
      />
    );
  }
}

FacebookLoginButton.propTypes = {
  afterLogin: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

export default FacebookLoginButton;
