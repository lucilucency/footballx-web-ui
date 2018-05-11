import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FbLoginBtn extends Component {
  constructor(props) {
    super(props);

    // post login behavior should be defined at a higher level
    this.onSuccess = this.props.onSuccess || (() => {});
    this.onFailure = this.props.onFailure || (() => {});
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  componentDidMount() {
    // This is the meat of the component
    // create a script tag, load FB SDK
    // then after script is loaded, set related behavior
    // If you have other components that rely on the FB SDK
    // I recommend extracting this into its own module
    const self = this;
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    let localize = localStorage.getItem('localization') || 'en-US';
    localize = localize.replace('-', '_');
    scriptTag.src = `https://connect.facebook.net/${localize}/sdk.js#xfbml=1&version=v3.0&appId=1800262673561624&autoLogAppEvents=1`;
    scriptTag.addEventListener('load', () => {
      self.FB = window.FB;
      // I don't like exposing the SDK to global scope
      window.FB = null;

      // This subscribe the callback when login status change
      // Full list of events is here
      // https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v2.9
      self.FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));
    });
    document.body.appendChild(scriptTag);
  }

  onStatusChange(response) {
    if (response.status === 'connected') {
      const { accessToken } = response.authResponse;
      // I have a afterLogin optional callback
      // which takes care of ads landing, invitation or any other custom behavior
      this.onSuccess(accessToken, this.props.afterLogin);
    } else {
      this.onFailure();
    }
  }

  render() {
    return (
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
