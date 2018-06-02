import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { getLeagueMatches } from '../../actions';
import { MatchGrid } from '../Match/components';
import { Container } from '../../utils';
import RightBar from './RightBar';
import leagues from '../../fxconstants/leaguesObj.json';

const getData = (props) => {
  const { match } = props;
  const leagueID = Number(match.params.id);

  if (!leagueID) {
    props.history.push('/');
  } else {
    props.getLeagueMatches(leagueID);
    Amplitude.logEvent(`View league ${leagues[leagueID] && leagues[leagueID].name}`);
  }
};

class LeageOverview extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    const leagueID = Number(match.params.id);

    if (!leagueID) {
      this.props.history.push('/');
    } else {
      this.props.getLeagueMatches(leagueID);
      Amplitude.logEvent(`View league ${leagues[leagueID] && leagues[leagueID].name}`);
    }
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      getData(props);
    }
  }

  render() {
    return (
      <div>
        <Helmet title="Match" />
        <Container
          columns="1fr 300px"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <MatchGrid />
          <RightBar />
        </Container>
      </div>
    );
  }
}

LeageOverview.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  // isLoggedIn: PropTypes.bool,
  getLeagueMatches: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
  data: state.app.match.data,
});

const mapDispatchToProps = dispatch => ({
  getLeagueMatches: (leagueID, args) => dispatch(getLeagueMatches(leagueID, args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeageOverview);