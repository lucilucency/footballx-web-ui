import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Amplitude from 'react-amplitude';
import { getMatches } from '../../../actions';
// import leagues from '../../../fxconstants/leaguesObj.json';
import MatchGrid from '../../Match/components/MatchGrid';

const start_time = new Date();
// start_time.setHours(0, 0, 0, 0);
const end_time = new Date();
end_time.setHours(23, 59, 59, 999);

const getSeasons = (props) => {
  // const { leagueID } = props;
  // props.getLeagueLastSeasons(leagueID, (seasons) => {
  //   if (seasons && seasons.length) {
  //     seasons.forEach((season) => {
  //       props.getSeasonMatches(season.id, {
  //         start_time: season.start_time,
  //         end_time: season.end_time,
  //       });
  //     });
  //   }
  // });

  Amplitude.logEvent('View upcoming matches');
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
  leagueID: PropTypes.number.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(RecentMatches);
