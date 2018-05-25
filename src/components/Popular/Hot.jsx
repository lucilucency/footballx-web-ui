import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PostGrid } from '../Post/components/index';
import { Container } from '../../utils/index';
import RightTrayComponent from './RightBar';
import { MatchGrid } from '../Match/components';

class NewFeeds extends React.Component {
  componentDidMount() {
    // console.log('in popular/hot');
  }

  render() {
    return (
      <div>
        <Helmet title="Hot" />
        <Container>
          <div>
            <MatchGrid
              bound="all"
              sorting="hot"
            />
            <PostGrid
              bound="all"
              sorting="hot"
            />
          </div>
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
