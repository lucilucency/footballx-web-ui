import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FacebookLogin from 'react-facebook-login';
import strings from '../../lang';

class ButtonGardenWrapper extends React.Component {
  constructor(props) {
    super(props);

    console.log('constructor');
  }

  render() {
    return (
      <FacebookLogin
        appId="161873251167984"
        autoLoad
        fields="name,email,picture"
        callback={(data) => {
          console.log('callback', data);
        }}
        render={renderProps => (
          <FlatButton
            label={<span className="label">{strings.home_sign_up_with_email}</span>}
            onClick={renderProps.onClick}
          />
        )}
      />
    );
  }
}

export default ButtonGardenWrapper;
