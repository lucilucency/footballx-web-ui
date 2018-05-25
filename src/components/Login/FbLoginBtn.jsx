/* global FB */
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
    const self = this;
    // const scriptTag = document.createElement('script');
    // scriptTag.type = 'text/javascript';
    // let localize = localStorage.getItem('localization') || 'en-US';
    // localize = localize.replace('-', '_');
    // scriptTag.src = `https://connect.facebook.net/${localize}/sdk.js#xfbml=1&version=v3.0&appId=1800262673561624&autoLogAppEvents=1`;
    // scriptTag.addEventListener('load', () => {
    //   self.FB = window.FB;
    //   // I don't like exposing the SDK to global scope
    //   window.FB = null;
    //
    //   // This subscribe the callback when login status change
    //   // Full list of events is here
    //   // https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v2.9
    //   self.FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));
    // });
    // document.body.appendChild(scriptTag);

    // self.FB = window.FB;
    // self.FB && self.FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));

    window.fbAsyncInit = () => {
      FB.init({
        appId: '1800262673561624',
        cookie: true,
        xfbml: true,
        version: 'v3.0',
      });
      FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));
    };

    let localize = localStorage.getItem('localization') || 'en-US';
    localize = localize.replace('-', '_');

    // Load the SDK asynchronously
    (function (d, s, id) {
      let js = d.getElementsByTagName(s)[0];
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/${localize}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  onStatusChange(response) {
    if (response.status === 'connected') {
      const { accessToken } = response.authResponse;
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
