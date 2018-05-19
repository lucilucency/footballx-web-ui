import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setMatch, getMatch, getMatchVotes } from '../../actions';
import { ViewMatchFull } from './components';

class PageViewMatch extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.data) {
      this.props.setMatch(location.state.data);
      this.props.getMatchVotes(location.state.data.id);
    } else {
      this.props.getMatch(this.props.match.params.id);
      this.props.getMatchVotes(this.props.match.params.id);
    }
  }

  render() {
    const { isLoggedIn, match, data } = this.props;
    const matchID = Number(match.params.id);

    if (!matchID) {
      this.props.history.push('/');
    }

    return (
      <div>
        <Helmet title="Match" />
        <ViewMatchFull
          isLoggedIn={isLoggedIn}
          matchID={matchID}
          data={data}
        />
      </div>
    );
  }
}

PageViewMatch.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,

  isLoggedIn: PropTypes.bool,
  data: PropTypes.object,

  setMatch: PropTypes.func,
  getMatch: PropTypes.func,
  getMatchVotes: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),

  data: state.app.match.data,
});

const mapDispatchToProps = dispatch => ({
  setMatch: payload => dispatch(setMatch(payload)),
  getMatch: matchID => dispatch(getMatch(matchID)),
  getMatchVotes: matchID => dispatch(getMatchVotes(matchID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageViewMatch);
