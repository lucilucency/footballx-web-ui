/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
// import constants from '../../constants';
import { ViewPostCompact } from './index';

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
    this.columnCount = 1;
  }

  render() {
    return (
      <PostsGridStyled columns={this.columnCount}>
        {this.props.posts.map(item => <ViewPostCompact data={item} key={item.id || Date.now()} />)}
      </PostsGridStyled>
    );
  }
}

RequestLayer.propTypes = {
  posts: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

// const mapDispatchToProps = dispatch => ({
//   dispatchPosts: params => dispatch(getPosts(params)),
// });

export default connect(mapStateToProps, null)(RequestLayer);
