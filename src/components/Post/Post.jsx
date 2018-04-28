/* eslint-disable no-eval,react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class RequestLayer extends React.Component {
  componentDidMount() {
    console.warn('done mount');
  }

  render() {
    return (
      <div>
        <Helmet title="Post" />
        <h1>Post content here</h1>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//
// });

// const mapDispatchToProps = dispatch => ({
// });

export default connect(null, null)(RequestLayer);
