import React from 'react';
import { connect } from 'react-redux';

class GetAppPage extends React.Component {
  componentDidMount() {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
      window.location = 'https://itunes.apple.com/app/football-x/id1182333199?mt=8';
    }
    // Android Version:
    if (navigator.userAgent.match(/android/i)) {
      window.location = 'https://play.google.com/store/apps/details?id=com.ttab.footballx';
    }
  }

  render() {
    return (
      <div>
        <h1>Get FootballX</h1>
      </div>
    );
  }
}

export default connect(null, null)(GetAppPage);
