import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import LazyLoad from 'react-lazyload';
import { getMeFeeds, getPostsWorld } from '../../../actions/index';
import { ViewPostCompact, ViewPostCompactBlank } from './index';
// import constants from '../../constants';

const PostsGridStyled = styled.div`
  max-width: 900px;
  ${props => props.columns && css`
    -moz-column-count: ${props.columns}; 
    -webkit-column-count: ${props.columns}; 
    column-count: ${props.columns};
    -moz-column-gap: 1em;
    -webkit-column-gap: 1em; 
    column-gap: 1em;
  `}
  
  > div {
     display: inline-block;
     margin-bottom: 1em;
     width: 100%; 
  }
`;


class PostGrid extends React.Component {
  componentDidMount() {
    this.columnCount = 1;
    if (!this.props.isLoggedIn) {
      this.props.getWorldFeeds({ sortby: this.props.sorting });
    } else if (this.props.filter === 'world') {
      this.props.getWorldFeeds({ sortby: this.props.sorting, xuser_id: this.props.user.id });
    } else if (this.props.token) {
      this.props.getMeFeeds({
        sorting: this.props.sorting,
        xuser_id: this.props.user.id,
      });
    } else {
      this.props.getWorldFeeds({ sortby: this.props.sorting });
    }
  }

  renderPostsGrid() {
    if (this.props.posts.length) {
      return this.props.posts.map((item, index) => {
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
      <PostsGridStyled columns={this.columnCount}>
        {this.renderPostsGrid()}
      </PostsGridStyled>
    );
  }
}

PostGrid.propTypes = {
  // filter: PropTypes.string,
  sorting: PropTypes.string,
  filter: PropTypes.string,

  /**/
  posts: PropTypes.array,
  loading: PropTypes.bool,
  user: PropTypes.object,
  getMeFeeds: PropTypes.func,
  getWorldFeeds: PropTypes.func,
  token: PropTypes.string,
  isLoggedIn: PropTypes.bool,

};

PostGrid.defaultProps = {
  sorting: 'new',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PostGrid);
