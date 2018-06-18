import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PostGrid } from '../Post/components/index';
import { Container } from '../../utils/index';
import RightBar from './RightBar';
// import { MatchGrid } from '../Match/components';

class HomeNew extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Helmet title="News feed" />
        <Container>
          <div>
            <PostGrid
              bound="mine"
              sorting="new"
            />
          </div>
          <RightBar />
        </Container>
      </div>
    );
  }
}

HomeNew.propTypes = {
};

// const mapStateToProps = state => ({
//   browser: state.browser,
//   loading: state.app.posts.loading,
// });

export default connect(null, null)(HomeNew);
