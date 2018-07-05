import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import { loginFb } from '../../actions';
import strings from '../../lang';
import FacebookLoginButton from './FacebookLoginButton';

const OrLine = styled.div`
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #869197;
  text-align: center;
  font-size: 14px;
  margin: 35px 0;
  height: 24px;
  
  :before {
    right: 0;
    content: "";
    position: absolute;
    top: 12px;
    width: 40%;
    border-top: 1px solid #ccd5d9;
  }
  :after {
    left: 0;
    content: "";
    position: absolute;
    top: 12px;
    width: 40%;
    border-top: 1px solid #ccd5d9;
  }
`;

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
    this.doLoginFb = this.doLoginFb.bind(this);
  }

  doLoginFb(userFbData) {
    const that = this;
    const fbToken = userFbData;
    this.props.loginFacebook(fbToken).then((o, e) => {
      if (!e) {
        if (o.payload) {
          const { state } = this.props.location;
          if (state && state.from) {
            that.props.history.push(state.from.pathname);
          } else {
            const goTo = localStorage.getItem('previousPage') || '/';
            that.props.history.push(goTo);
          }
        } else {
          that.setState({
            loginError: true,
            message: e,
          });
        }
      }
    });
  }

  // handleTextFieldKeyDown = (event) => {
  //   const that = this;
  //   switch (event.key) {
  //     case 'Enter':
  //       that.doLogin();
  //       break;
  //     case 'Escape':
  //       // etc...
  //       break;
  //     default: break;
  //   }
  // };

  render() {
    return (
      <div>
        <FacebookLoginButton
          onSuccess={this.doLoginFb}
          onFailure={(err) => {
            console.warn('err', err);
          }}
          // afterLogin={}
        />
        {/* <FbLoginBtn
          width={250}
          dataScope="public_profile,email,user_birthday,user_gender"
          onSuccess={this.doLoginFb}
          onFailure={(err) => {
            console.warn('err', err);
          }}
        /> */}
        <OrLine>or</OrLine>
        <form>
          <TextField
            hintText="Enter your Username"
            floatingLabelText="Username"
            // onChange={(event, newValue) => this.setState({ username: newValue, message: '' })}
            // onKeyDown={this.handleTextFieldKeyDown}
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            // onChange={(event, newValue) => this.setState({ password: newValue })}
            // onKeyDown={this.handleTextFieldKeyDown}
            errorText={this.state.message}
          />
          <br />
          <FlatButton label={strings.app_login} primary />
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  location: PropTypes.object,
  loginFacebook: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  loginFacebook: accessToken => dispatch(loginFb(accessToken)),
});

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
