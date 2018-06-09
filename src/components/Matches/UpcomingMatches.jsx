import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Amplitude from 'react-amplitude';
import { getMatches } from '../../actions/index';
// import leagues from '../../../fxconstants/leaguesObj.json';
import MatchGrid from './components/MatchGrid';

const start_time = new Date();
// start_time.setHours(0, 0, 0, 0);
const end_time = new Date();
end_time.setHours(23, 59, 59, 999);

const getSeasons = (props) => {
  Amplitude.logEvent('View upcoming matches');
  props.getMatches({ start_time: parseInt(start_time / 1000, 10), end_time: parseInt((end_time / 1000) + 84600, 10) });
};

class UpcomingMatches extends React.Component {
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

UpcomingMatches.propTypes = {
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
  // getLeagueLastSeasons: (leagueID, callback) => {
  //   dispatch(localLoadingReducer('seasons', []));
  //   dispatch(localLoadingReducer('matches', []));
  //   return dispatch(getLeagueLastSeasons(leagueID, callback));
  // },
  // getSeasonMatches: (seasonID, args) => dispatch(getSeasonMatches(seasonID, args)),
  getMatches: args => dispatch(getMatches(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingMatches);
