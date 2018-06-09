import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { HotMatchGrid } from '../Match/components';
import { Container } from '../../utils/index';

class HotMatches extends React.Component {
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
        </Container>
      </div>
    );
  }
}

HotMatches.propTypes = {
};

// const mapStateToProps = state => ({
//   browser: state.browser,
//   loading: state.app.posts.loading,
// });

export default connect(null, null)(HotMatches);
