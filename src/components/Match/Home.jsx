import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { MatchGrid } from '../Match/components';
import { Container, toDateString } from '../../utils';
import strings from '../../lang';
import RightBar from './RightBar';
import TabBar from '../TabBar';

const start_time = new Date();
start_time.setHours(0, 0, 0, 0);
const end_time = new Date();
end_time.setHours(23, 59, 59, 999);

const matchTabs = [{
  name: toDateString(start_time - 86400),
  key: 'yesterday',
  content: () => (
    <MatchGrid
      grouped
      start_time={parseInt(start_time.getTime() / 1000, 10) - 86400}
      end_time={parseInt(start_time.getTime() / 1000, 10)}
    />
  ),
  route: '/matches/yesterday',
}, {
  name: strings.label_today,
  key: 'today',
  content: () => (
    <MatchGrid
      grouped
      start_time={parseInt(start_time.getTime() / 1000, 10)}
      end_time={parseInt(end_time.getTime() / 1000, 10)}
    />
  ),
  route: '/matches/today',
}, {
  name: toDateString(start_time + 86400),
  key: 'tomorrow',
  content: () => (
    <MatchGrid
      grouped
      start_time={parseInt(end_time.getTime() / 1000, 10)}
      end_time={parseInt(end_time.getTime() / 1000, 10) + 86400}
    />
  ),
  route: '/matches/tomorrow',
}];

class MatchHome extends React.Component {
  componentDidMount() {
    Amplitude.logEvent('View match');
  }

  render() {
    const route = this.props.match.params.info || 'today';
    const tab = matchTabs.find(_tab => _tab.key === route);

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
          <div>
            <TabBar
              info={route}
              tabs={matchTabs}
            />
            {tab && tab.content(this.props)}
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
