import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getCommunityFeeds } from '../../actions/index';

const getData = (props) => {
  props.getCommunityFeeds(props.communityID, {
    sortby: 'controversy',
    xuser_id: props.loggedInUserID,
  });
};

class CommunityFeedControversy extends React.Component {
  componentDidMount() {
    if (!this.props.posts || !this.props.posts.length) {
      getData(this.props);
    }
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

CommunityFeedControversy.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CommunityFeedControversy);
