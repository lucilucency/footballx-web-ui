import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Amplitude from 'react-amplitude';
import { getMatches } from '../../actions/index';
import MatchGrid from './components/MatchGrid';

const start_time = new Date();
// start_time.setHours(0, 0, 0, 0);
const end_time = new Date();
end_time.setHours(23, 59, 59, 999);

const getSeasons = (props) => {
  Amplitude.logEvent('View recent matches');
  props.getMatches({ start_time: parseInt((end_time / 1000) - 172800, 10), end_time: parseInt(start_time / 1000, 10) });
};

class RecentMatches extends React.Component {
  componentDidMount() {
    getSeasons(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.leagueID !== this.props.leagueID) {
      getSeasons(props);
    }
  }

  render() {
    const { matches, seasons, leagueID } = this.props;

    return (
      <MatchGrid leagueID={leagueID} matches={matches} seasons={seasons} />
    );
  }
}

RecentMatches.propTypes = {
  leagueID: PropTypes.number,
  matches: PropTypes.array,
  seasons: PropTypes.array,
  // history: PropTypes.object,
  // isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
  seasons: state.app.seasons.data,
  matches: state.app.matches.data || [],
});

const mapDispatchToProps = dispatch => ({
  getMatches: args => dispatch(getMatches(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentMatches);
