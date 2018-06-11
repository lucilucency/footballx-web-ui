import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'querystring';
import Amplitude from 'react-amplitude';
import { getCookie } from '../../utils';

class GamePort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Amplitude.logEvent('Enter game');
  }

  render() {
    const { browser } = this.props;
    const params = {
      access_token: getCookie('access_token'),
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
  banner: PropTypes.object,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
  banner: state.app.banner.data,
});

// const mapDispatchToProps = dispatch => ({
//   toggleTray: props => dispatch(toggleTray(props)),
// });

export default connect(mapStateToProps)(GamePort);
