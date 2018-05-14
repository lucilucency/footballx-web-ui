import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { CreateEditPostFrame } from './components';

class PageCreatePost extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Helmet title="Up your thought" />
        <CreateEditPostFrame user={this.props.user} browser={this.props.browser} />
      </div>
    );
  }
}

PageCreatePost.propTypes = {
  user: PropTypes.object,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.user,
  browser: state.browser,
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(mapStateToProps, null)(PageCreatePost);
