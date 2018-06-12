import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import strings from '../../lang';
import { setMatch, getMatch, getMatchVotes } from '../../actions';
import { MatchView } from './components';
import { Container } from '../../utils';
import TabBar from '../TabBar';
import LineUps from './LineUps';
import LiveStream from './LiveStream';
import MatchInfo from './MatchInfo';
import Stats from './Stats';
import FanFighting from './FanFighting';

const tabs = matchID => [
  null && {
    name: strings.label_match_info,
    key: 'info',
    content: propsVar => <MatchInfo data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/m/${matchID}/info`,
  },
  {
    name: strings.label_fan_fight,
    key: 'fan-fight',
    content: propsVar => <FanFighting data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} matchID={propsVar.matchID} />,
    route: `/m/${matchID}/fan-fight`,
  },
  null && {
    name: strings.label_line_ups,
    key: 'line-ups',
    content: propsVar => <LineUps data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/m/${matchID}/line-ups`,
  },
  null && {
    name: strings.label_stats,
    key: 'stats',
    content: propsVar => <Stats data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/m/${matchID}/stats`,
  },
  null && {
    name: strings.label_live_stream,
    key: 'live',
    content: propsVar => <LiveStream data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/m/${matchID}/live`,
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
    const matchID = Number(match.params.id);
    const info = match.params.info || 'fan-fight';
    const tab = tabs(matchID).find(_tab => _tab.key === info);

    if (!matchID || !tab) {
      this.props.history.push('/');
    }

    return (
      <div>
        <Helmet title="Match" />
        <Container
          columns={tab && tab.rightBar ? '[full-start] minmax(0, 1fr) [main-start] minmax(10em, 300px) [main-end] minmax(0, 0) [full-end]' : '1fr'}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <MatchView
              matchID={matchID}
              data={data}
              isLoggedIn={isLoggedIn}
            />
            <TabBar
              info={info}
              tabs={tabs(matchID)}
            />
            {tab && tab.content({ data, isLoggedIn, matchID })}
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
