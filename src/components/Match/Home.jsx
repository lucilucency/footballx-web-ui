import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { Container } from '../../utils';
import strings from '../../lang';
import RightBar from './RightBar';
import TabBar from '../TabBar';
import UpcomingMatches from './components/UpcomingMatches';
import RecentMatches from './components/RecentMatches';

const matchTabs = [{
  name: strings.label_recent_matches,
  key: 'recent',
  content: <RecentMatches />,
  route: '/matches/recent',
}, {
  name: strings.label_upcoming_matches,
  key: 'upcoming',
  content: <UpcomingMatches />,
  route: '/matches/upcoming',
}];

class MatchHome extends React.Component {
  componentDidMount() {
    Amplitude.logEvent('View match');
  }

  render() {
    const route = this.props.match.params.info || 'upcoming';
    const tab = matchTabs.find(_tab => _tab.key === route);

    return (
      <div>
        <Helmet title="Matches" />
        <Container
          columns="1fr 300px"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <TabBar
              info={route}
              tabs={matchTabs}
            />
            {tab && tab.content}
          </div>
          <RightBar />
        </Container>
      </div>
    );
  }
}

MatchHome.propTypes = {
  // isLoggedIn: PropTypes.bool,
  match: PropTypes.object,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
  data: state.app.match.data,
});

export default connect(mapStateToProps)(MatchHome);
