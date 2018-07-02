import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';
import { ViewPostCompact, ViewPostCompactBlank } from './index';
import { PostsGridStyled } from './Styled';

class PostGrid extends React.Component {
  componentDidMount() {
    this.columnCount = 1;
  }

  renderPostsGrid() {
    if (this.props.posts.length) {
      const { posts } = this.props;

      const followingCommunityIDs = this.props.followingCommunities.map(el => el.id);
      const isFollowing = communityID => followingCommunityIDs.indexOf(communityID) !== -1;

      return posts.map((item, index) => {
        if (index > 5) {
          return (
            <LazyLoad height={200} key={item.id}>
              <ViewPostCompact
                data={item}
                isLoggedIn={Boolean(this.props.loggedInUserID)}
                isCompact={this.props.isCompact}
                isFollowing={isFollowing(item.community_id)}
              />
            </LazyLoad>
          );
        }
        return (
          <ViewPostCompact
            key={item.id}
            data={item}
            isLoggedIn={Boolean(this.props.loggedInUserID)}
            isCompact={this.props.isCompact}
            isFollowing={isFollowing(item.community_id)}
          />
        );
      });
    }
    if (this.props.loading) {
      return (<ViewPostCompactBlank />);
    }
    return null;
  }

  render() {
    return (
      <PostsGridStyled columns={this.props.columns}>
        {this.renderPostsGrid()}
      </PostsGridStyled>
    );
  }
}

PostGrid.propTypes = {
  columns: PropTypes.number,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  loggedInUserID: PropTypes.number,
  /**/
  isCompact: PropTypes.bool,
  followingCommunities: PropTypes.array,
};

PostGrid.defaultProps = {
  columns: 1,
  // sorting: 'new', /* new, hot, top, controversy */
};

const mapStateToProps = state => ({
  isCompact: state.browser.lessThan.small,
  followingCommunities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
});

export default withRouter(connect(mapStateToProps)(PostGrid));
