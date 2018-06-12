import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Container } from '../../utils';
import { Calendar, LeagueMatches, Standing, Header } from './components/index';
import TabBar from '../TabBar';
import strings from '../../lang';

const tabs = leagueID => [{
  name: strings.label_matches,
  key: 'matches',
  content: <LeagueMatches leagueID={leagueID} />,
  rightBar: <Calendar />,
  route: `/l/${leagueID}/matches`,
}, {
  name: strings.label_standing,
  key: 'standing',
  content: <Standing leagueID={leagueID} />,
  rightBar: <Calendar />,
  route: `/l/${leagueID}/standing`,
}];

class ViewLeague extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    const leagueID = Number(match.params.id);

    if (!leagueID) {
      this.props.history.push('/matches');
    }
  }

  render() {
    const { match } = this.props;
    const info = match.params.info || 'matches';
    const leagueID = Number(match.params.id);
    const tab = tabs(leagueID).find(_tab => _tab.key === info);

    return (
      <div>
        <Helmet title="League" />
        <Container
          columns={tab && tab.rightBar ? '[full-start] minmax(0, 1fr) [main-start] minmax(10em, 300px) [main-end] minmax(0, 0) [full-end]' : '1fr'}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <Header leagueID={leagueID} />
            <TabBar
              info={info}
              tabs={tabs(leagueID)}
            />
            {tab && tab.content}
          </div>
          {tab && tab.rightBar}
        </Container>
      </div>
    );
  }
}

ViewLeague.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  // isLoggedIn: PropTypes.bool,
};

// const mapStateToProps = state => ({
//   isLoggedIn: Boolean(state.app.metadata.data.user),
//   seasons: state.app.seasons.data,
//   matches: state.app.matches.data,
// });
//
// const mapDispatchToProps = dispatch => ({
//   getLeagueLastSeasons: (leagueID) => {
//     dispatch(localSetReducer('matches', []));
//     dispatch(getLeagueLastSeasons(leagueID));
//   },
//   getSeasonMatches: (seasonID, args) => dispatch(getSeasonMatches(seasonID, args)),
// });

export default withRouter(connect()(ViewLeague));
