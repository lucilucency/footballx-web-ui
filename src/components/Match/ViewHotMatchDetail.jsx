import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { setMatch, getMatch, getMatchVotes } from '../../actions';
import { HotMatchView } from './components';
import { Container } from '../../utils';


class HotMatchDetail extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.data) {
      this.props.setMatch(location.state.data);
      this.props.getMatchVotes(location.state.data.id);
    } else {
      this.props.getMatch(this.props.match.params.id);
      this.props.getMatchVotes(this.props.match.params.id);
    }

    Amplitude.logEvent('View match detail');
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
        <Container
          columns="1fr"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <HotMatchView
            isLoggedIn={isLoggedIn}
            matchID={matchID}
            data={data}
          />
        </Container>
      </div>
    );
  }
}

HotMatchDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HotMatchDetail);
