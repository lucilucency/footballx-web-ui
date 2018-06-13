import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'querystring';
import Amplitude from 'react-amplitude';
import { getCookie } from '../../utils';
import { langs } from '../../lang/index';

class GamePort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.user) {
      Amplitude.logEvent('Enter game');
    } else {
      localStorage.setItem('previousPage', '/game');
      window.location.href = '/sign_in';
    }
  }

  render() {
    const { browser } = this.props;
    const params = {
      access_token: getCookie('access_token'),
      lang: window.localStorage.getItem('localization') || langs[0].value,
    };

    const url = this.props.banner.url || 'https://game.footballx.live';

    return (
      <iframe
        title="game-port"
        src={`${url}?${queryString.stringify(params)}`}
        width={browser.width}
        height={browser.height - 60}
        scrolling="auto"
        frameBorder="1"
        align="center"
      />
    );
  }
}

GamePort.propTypes = {
  user: PropTypes.object,
  banner: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  browser: state.browser,
  banner: state.app.banner.data,
});

// const mapDispatchToProps = dispatch => ({
//   toggleTray: props => dispatch(toggleTray(props)),
// });

export default connect(mapStateToProps)(GamePort);
