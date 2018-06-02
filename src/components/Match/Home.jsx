import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import { getMatches } from '../../actions';
import { MatchGrid } from '../Match/components';
import { Container } from '../../utils';
import RightBar from './RightBar';

const getData = (props) => {
  const start_time = new Date();
  start_time.setHours(0, 0, 0, 0);
  const end_time = new Date();
  end_time.setHours(23, 59, 59, 999);

  props.getMatches({
    start_time: parseInt(start_time.getTime() / 1000, 10),
    end_time: parseInt(end_time.getTime() / 1000, 10),
  });
  Amplitude.logEvent('View match');
};

class MatchHome extends React.Component {
  componentDidMount() {
    getData(this.props);
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
          <MatchGrid grouped />
          <RightBar />
        </Container>
      </div>
    );
  }
}

MatchHome.propTypes = {
  // isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
  data: state.app.match.data,
});

const mapDispatchToProps = dispatch => ({
  getMatches: args => dispatch(getMatches(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchHome);
