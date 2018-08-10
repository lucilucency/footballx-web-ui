import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getUserPosts } from '../../actions/index';

class UserPosts extends React.Component {
  componentDidMount() {
    this.props.getUserPosts(this.props.loggedInUserID, this.props.loggedInUserID);
  }

  render() {
    return (
      <div>
        <PostGrid
          posts={this.props.posts}
          loading={this.props.loading}
          loggedInUserID={this.props.loggedInUserID}
        />
      </div>
    );
  }
}

UserPosts.propTypes = {
  /**/
  loggedInUserID: PropTypes.number,
  posts: PropTypes.array,
  loading: PropTypes.bool,
  getUserPosts: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  getUserPosts: (xuserID, loggedInUserID) => dispatch(getUserPosts(xuserID, { loggedInUserID })),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPosts);
