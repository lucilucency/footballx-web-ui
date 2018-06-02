import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { HotMatchGrid } from '../Match/components';
import { Container } from '../../utils/index';
import RightTrayComponent from './RightBar';

class NewFeeds extends React.Component {
  componentDidMount() {
    // console.log('in popular/hot');
  }

  render() {
    return (
      <div>
        <Helmet title="Hot" />
        <Container>
          <HotMatchGrid
            bound="all"
            sorting="hot"
          />
          <RightTrayComponent />
        </Container>
      </div>
    );
  }
}

NewFeeds.propTypes = {
};

// const mapStateToProps = state => ({
//   browser: state.browser,
//   loading: state.app.posts.loading,
// });

export default connect(null, null)(NewFeeds);
