import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import strings from '../../lang';
import { setMatch, getMatch, getMatchVotes } from '../../actions';
import TeamVisualize from './components/TeamVisualize';
import { Container } from '../../utils';
import TabBar from '../TabBar';
import Squad from './Squad';

const tabs = matchID => [
  {
    name: strings.label_line_ups,
    key: 'squad',
    content: propsVar => <Squad data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/m/${matchID}/line-ups`,
  },
].filter(Boolean);

class MatchDetail extends React.Component {
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
    const teamID = Number(match.params.id);
    const info = match.params.info || 'squad';
    const tab = tabs(teamID).find(_tab => _tab.key === info);

    if (!teamID || !tab) {
      this.props.history.push('/');
    }

    return (
      <div>
        <Helmet title="Team" />
        <Container
          columns={tab && tab.rightBar ? '[full-start] minmax(0, 1fr) [main-start] minmax(10em, 300px) [main-end] minmax(0, 0) [full-end]' : '1fr'}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <TeamVisualize
              teamID={teamID}
              data={data}
              isLoggedIn={isLoggedIn}
            />
            <TabBar
              info={info}
              tabs={tabs(teamID)}
            />
            {tab && tab.content({ data, isLoggedIn })}
          </div>
          {tab && tab.rightBar}
        </Container>
      </div>
    );
  }
}

MatchDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchDetail);
