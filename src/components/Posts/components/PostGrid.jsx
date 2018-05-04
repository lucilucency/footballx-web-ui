import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { getPosts } from '../../../actions';
// import constants from '../../constants';
import { ViewPostCompact } from '../../Post/components';

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

class RequestLayer extends React.Component {
  componentDidMount() {
    this.props.dispatchPosts('hot');
    this.columnCount = 1;
  }

  render() {
    return (
      <PostsGridStyled columns={this.columnCount}>
        {this.props.posts.map(item => <ViewPostCompact data={item} key={item.id} />)}
      </PostsGridStyled>
    );
  }
}

RequestLayer.propTypes = {
  posts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatchPosts: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  dispatchPosts: params => dispatch(getPosts(params)),
});

// eslint-disable-next-line import/prefer-default-export
export const PostGrid = connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
