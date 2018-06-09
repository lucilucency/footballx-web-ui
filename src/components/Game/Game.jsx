import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'querystring';
import { getCookie } from '../../utils';

class GamePort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { browser } = this.props;
    const params = {
      access_token: getCookie('access_token'),
    };

    const url = 'https://game.footballx.live';

    return (
      <iframe
        title="game-port"
        src={`${url}?${queryString.stringify(params)}`}
        width={browser.width}
        height={browser.height}
        scrolling="auto"
        frameBorder="1"
        align="center"
      />
    );
  }
}

GamePort.propTypes = {
  // url: PropTypes.string,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

// const mapDispatchToProps = dispatch => ({
//   toggleTray: props => dispatch(toggleTray(props)),
// });

export default connect(mapStateToProps)(GamePort);
