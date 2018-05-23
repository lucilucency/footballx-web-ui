import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PostGrid } from '../Post/components/index';
import { Container } from '../../utils/index';
import RightTrayComponent from './RightTray';

class HomeControversy extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Helmet title="News feed" />
        <Container>
          <PostGrid
            bound="mine"
            sorting="controversy"
          />
          <RightTrayComponent />
        </Container>
      </div>
    );
  }
}

HomeControversy.propTypes = {
};

// const mapStateToProps = state => ({
//   browser: state.browser,
//   loading: state.app.posts.loading,
// });

export default connect(null, null)(HomeControversy);
