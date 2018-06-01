import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import LazyLoad from 'react-lazyload';
import { getHotMatches } from '../../../../actions/index';
import { ViewMatchCompact, ViewMatchCompactBlank } from '../index';
// import constants from '../../constants';

const PostsGridStyled = styled.div`
  //max-width: 900px;
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


class MatchGrid extends React.Component {
  componentDidMount() {
    this.props.getMatches();
  }

  renderGrid() {
    if (this.props.matches.length) {
      return this.props.matches.map(item => (
        <LazyLoad height={200} key={item.id}>
          <ViewMatchCompact data={item} isLoggedIn={this.props.isLoggedIn} />
        </LazyLoad>
      ));
    }

    if (this.props.loading) {
      return (<ViewMatchCompactBlank />);
    }

    return null;
  }

  render() {
    return (
      <PostsGridStyled columns={this.columnCount}>
        {this.renderGrid()}
      </PostsGridStyled>
    );
  }
}

MatchGrid.propTypes = {
  // sorting: PropTypes.string,
  // filter: PropTypes.string,

  /**/
  // user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  matches: PropTypes.array,
  loading: PropTypes.bool,
  getMatches: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  matches: state.app.matches.data,
  loading: state.app.matches.loading,
});

const mapDispatchToProps = dispatch => ({
  getMatches: () => dispatch(getHotMatches()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchGrid);
