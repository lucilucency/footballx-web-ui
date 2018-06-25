import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getCommunityFeeds } from '../../actions/index';

const getData = (props) => {
  props.getCommunityFeeds(props.communityID, {
    sortby: 'top',
    xuser_id: props.loggedInUserID,
  });
};

class CommunityFeedTop extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.communityID !== this.props.communityID) {
      getData(props);
    }
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

CommunityFeedTop.propTypes = {
  communityID: PropTypes.number.isRequired,
  loggedInUserID: PropTypes.number,
  /**/
  posts: PropTypes.array,
  loading: PropTypes.bool,
  // getCommunityFeeds: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  getCommunityFeeds: (communityID, { sortby, xuser_id }) => dispatch(getCommunityFeeds(communityID, { sortby, xuser_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityFeedTop);
