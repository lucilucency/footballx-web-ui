import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { getLeagueLastSeasons, localSetReducer, getSeasonMatches } from '../../actions';
import { Container } from '../../utils';
import RightBar from './RightBar';
import leagues from '../../fxconstants/leaguesObj.json';
import MatchGrid from '../Match/components/MatchGrid';

const getSeasons = (props) => {
  const { match } = props;
  const leagueID = Number(match.params.id);

  if (!leagueID) {
    props.history.push('/');
  } else {
    props.getLeagueLastSeasons(leagueID);
    Amplitude.logEvent(`View league ${leagues[leagueID] && leagues[leagueID].name}`);
  }
};

const getMatches = (props) => {
  if (props.seasons && props.seasons.length) {
    props.seasons.forEach((season) => {
      props.getSeasonMatches(season.id, {
        start_time: season.start_time,
        end_time: season.end_time,
      });
    });
  }
};

class LeageOverview extends React.Component {
  componentDidMount() {
    getSeasons(this.props);
    getMatches(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      getSeasons(props);
    }
    if (props.seasons !== this.props.seasons) {
      getMatches(props);
    }
  }

  render() {
    const { match } = this.props;
    const leagueID = Number(match.params.id);

    return (
      <div>
        <Helmet title="League" />
        <Container
          columns="1fr 300px"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          {/* <div>
            {this.props.seasons && this.props.seasons.map(season => <MatchesInSeason key={`season_${season.id}`} season={season} leagueID={leagueID} />)}
          </div> */}
          <MatchGrid leagueID={leagueID} />
          <RightBar />
        </Container>
      </div>
    );
  }
}

LeageOverview.propTypes = {
  match: PropTypes.object,
  seasons: PropTypes.array,
  // history: PropTypes.object,
  // isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
  seasons: state.app.seasons.data,
});

const mapDispatchToProps = dispatch => ({
  getLeagueLastSeasons: (leagueID) => {
    dispatch(localSetReducer('matches', []));
    dispatch(getLeagueLastSeasons(leagueID));
  },
  getSeasonMatches: (seasonID, args) => dispatch(getSeasonMatches(seasonID, args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeageOverview);
