import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = styled.div`
  background: #4267b2;
  border-radius: 5px;
  color: white;
  height: 40px;
  text-align: center;
  width: 250px;
  margin: auto;
  line-height: 40px;
`;

function finished_rendering() {
  const spinner = document.getElementById('spinner');
  spinner.removeAttribute('style');
  spinner.removeChild(spinner.childNodes[0]);
}

class FbLoginBtn extends Component {
  constructor(props) {
    super(props);

    // post login behavior should be defined at a higher level
    this.onSuccess = this.props.onSuccess || (() => {});
    this.onFailure = this.props.onFailure || (() => {});
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  componentDidMount() {
    const self = this;
    self.FB = window.FB;

    if (window.FB) {
      window.FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));
      // window.FB.Event.subscribe('auth.authResponseChange', self.onStatusChange.bind(self));
      window.FB.Event.subscribe('xfbml.render', finished_rendering);
    }
  }

  onStatusChange(response) {
    if (response.status === 'connected') {
      const { accessToken } = response.authResponse;
      this.onSuccess(accessToken, this.props.afterLogin);
      // window.FB.api('/me', (response) => {
      //   console.log('Successful login for: ', response.name);
      // });
    } else {
      this.onFailure();
    }
  }

  render() {
    return (
      <div>
        {/* <div
          className="fb-login-button"
          data-max-rows="1"
          data-size="large"
          data-button-type="login_with"
          data-show-faces="false"
          data-auto-logout-link="false"
          data-use-continue-as="true"
          data-scope={this.props.dataScope}
          data-width={this.props.width}
        /> */}
        <Styled id="spinner">
          Loading...
          <div
            className="fb-login-button"
            data-max-rows="1"
            data-size="large"
            data-button-type="login_with"
            data-show-faces="false"
            data-auto-logout-link="false"
            data-use-continue-as="true"
            data-scope={this.props.dataScope}
            data-width={this.props.width}
          />
        </Styled>
      </div>
    );
  }
}

FbLoginBtn.propTypes = {
  dataScope: PropTypes.string,
  width: PropTypes.number,
  afterLogin: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

export default FbLoginBtn;
