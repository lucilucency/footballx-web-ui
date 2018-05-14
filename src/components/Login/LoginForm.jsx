import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
// import FacebookLogin from 'react-facebook-login';
import styled from 'styled-components';
import { loginFb } from '../../actions';
import strings from '../../lang';
import { setCookie } from '../../utils';
import FbLoginBtn from './FbLoginBtn';

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
    const token = userFbData;
    that.props.loginFbFn(token).then((o, e) => {
      if (!e) {
        if (o.payload) {
          const data = o.payload;
          setCookie('access_token', data.access_token, 7);
          setCookie('user_id', data.user.id, 7);

          // that.props.history.push('/');
          window.location.href = '/';
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
        <FbLoginBtn
          width={250}
          dataScope="public_profile,email,user_birthday,user_gender"
          onSuccess={this.doLoginFb}
          onFailure={(err) => {
            console.warn('err', err);
          }}
          // afterLogin={}
        />
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
          <FlatButton label={strings.home_login} primary />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginFbFn: accessToken => dispatch(loginFb(accessToken)),
});

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
