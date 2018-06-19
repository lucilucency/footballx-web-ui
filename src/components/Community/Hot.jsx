import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getCommunityFeeds } from '../../actions/index';

class CommunityFeedHot extends React.Component {
  componentDidMount() {
    this.props.getCommunityFeeds(this.props.communityID, {
      sortby: 'hot',
      xuser_id: this.props.loggedInUserID,
    });
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

CommunityFeedHot.propTypes = {
  communityID: PropTypes.number.isRequired,
  loggedInUserID: PropTypes.number,
  /**/
  posts: PropTypes.array,
  loading: PropTypes.bool,
  getCommunityFeeds: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  getCommunityFeeds: (communityID, { sortby, xuser_id }) => dispatch(getCommunityFeeds(communityID, { sortby, xuser_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityFeedHot);
