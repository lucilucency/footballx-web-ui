import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { getMeFeeds, getPostsWorld } from '../../../actions/index';
import { ViewPostCompact, ViewPostCompactBlank } from './index';
import { PostsGridStyled } from './Styled';

class PostGrid extends React.Component {
  componentDidMount() {
    this.columnCount = 1;

    switch (this.props.bound) {
      case 'mine':
        this.props.getMeFeeds({
          sortby: this.props.sorting,
          xuser_id: this.props.user && this.props.user.id,
        });
        break;
      case 'all':
        this.props.getWorldFeeds({
          sortby: this.props.sorting,
          xuser_id: this.props.user && this.props.user.id,
        });
        break;
      case 'community':
        this.props.getCommunityFeeds({
          sortby: this.props.sorting,
          xuser_id: this.props.user && this.props.user.id,
        });
        break;
      default:
        break;
    }
  }

  renderPostsGrid() {
    if (this.props.posts.length) {
      let { posts } = this.props;
      if (this.props.bound === 'community') {
        posts = posts.filter(el => el.community_id === this.props.communityID);
      }

      return posts.map((item, index) => {
        if (index > 5) {
          return (
            <LazyLoad height={200} key={item.id}>
              <ViewPostCompact data={item} isLoggedIn={this.props.isLoggedIn} />
            </LazyLoad>
          );
        }
        return <ViewPostCompact key={item.id} data={item} isLoggedIn={this.props.isLoggedIn} />;
      });
    }
    if (this.props.loading) {
      return (<ViewPostCompactBlank />);
    }
    return null;
  }

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        <SelectField
          // floatingLabelText="Sorting"
          value={this.props.sorting}
          onChange={(e, index, value) => {
            const { pathname } = window.location;
            if (pathname === '/') {
              this.props.history.push(`/${value}`);
            } else {
              const lastSegment = pathname.substr(pathname.lastIndexOf('/') + 1);
              if (['new', 'hot', 'top', 'controversy'].indexOf(lastSegment) !== -1) {
                this.props.history.push(`${pathname.slice(0, pathname.lastIndexOf('/'))}/${value}`);
              } else {
                this.props.history.push(`${pathname}/${value}`);
              }
            }
          }}
          style={{
            width: 150,
          }}
          // underlineStyle={{ display: 'none' }}
        >
          <MenuItem value="hot" primaryText="Hot" />
          <MenuItem value="new" primaryText="New" />
          <MenuItem value="top" primaryText="Top" />
          <MenuItem value="controversy" primaryText="Controversy" />
        </SelectField>
        <PostsGridStyled columns={this.props.columns}>
          {this.renderPostsGrid()}
        </PostsGridStyled>
      </div>
    );
  }
}

PostGrid.propTypes = {
  bound: PropTypes.string,
  columns: PropTypes.number,
  sorting: PropTypes.string,
  communityID: PropTypes.number,

  /**/
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  posts: PropTypes.array,
  loading: PropTypes.bool,
  getMeFeeds: PropTypes.func,
  getWorldFeeds: PropTypes.func,
  getCommunityFeeds: PropTypes.func,
};

PostGrid.defaultProps = {
  bound: 'all', /* all, mine, community */
  columns: 1,
  // sorting: 'new', /* new, hot, top, controversy */
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  token: state.app.metadata.data.access_token,
});

const mapDispatchToProps = dispatch => ({
  getMeFeeds: ({ sortby, xuser_id }) => dispatch(getMeFeeds({ sortby, xuser_id })),
  getWorldFeeds: ({ sortby, xuser_id }) => dispatch(getPostsWorld({ sortby, xuser_id })),
  getCommunityFeeds: ({ sortby, xuser_id }) => dispatch(getPostsWorld({ sortby, xuser_id })),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostGrid));
