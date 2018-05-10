import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { ViewPostFull } from './components';

class Post extends React.Component {
  componentDidMount() {
    console.warn('done mount');
  }

  render() {
    const { match } = this.props;
    const postID = match.params.id;
    return (
      <div>
        <Helmet title="Post" />
        <h1>Post content here {postID}</h1>
      </div>
    );
  }
}

Post.propTypes = {
  match: PropTypes.object,
  // user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.user,
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(mapStateToProps, null)(Post);
