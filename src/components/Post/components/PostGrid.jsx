import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { getMeFeeds, getPostsWorld } from '../../../actions/index';
import { ViewPostCompact, ViewPostCompactBlank } from './index';
// import constants from '../../constants';

const PostsGridStyled = styled.div`
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
    if (this.props.isLoggedIn) {
      this.props.getMeFeeds(this.props.sorting, this.props.user.id);
    } else {
      this.props.getWorldFeeds(this.props.sorting);
    }
  }

  renderPostsGrid() {
    if (this.props.posts.length) {
      return this.props.posts.map(item => <ViewPostCompact data={item} key={item.id || Date.now()} isLoggedIn={this.props.isLoggedIn} />);
    }

    return [...Array(10)].map((el, index) => (
      <ViewPostCompactBlank key={index} />
    ));
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
  isLoggedIn: PropTypes.bool,

  /**/
  posts: PropTypes.array,
  user: PropTypes.object,
  getMeFeeds: PropTypes.func,
  getWorldFeeds: PropTypes.func,
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
  getMeFeeds: (sortby, userID) => dispatch(getMeFeeds(sortby, userID)),
  getWorldFeeds: sortby => dispatch(getPostsWorld(sortby)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostGrid);
