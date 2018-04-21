import React from 'react';
import FacebookLogin from 'react-facebook-login';

class ButtonGardenWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);

    console.log('constructor');
  }

  componentDidMount() {

  }

  render() {
    return (
      <FacebookLogin
        appId="161873251167984"
        autoLoad
        fields="name,email,picture"
        callback={(data) => {
          console.log('data', data);
        }}
      />
    );
  }
}

export default ButtonGardenWrapper;
