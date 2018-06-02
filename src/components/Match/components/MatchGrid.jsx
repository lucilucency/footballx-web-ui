import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
// import LazyLoad from 'react-lazyload';
import MatchViewCompact from './MatchViewCompact';
import { MatchGridBlank } from '../../Blank';
// import constants from '../../constants';

const PostsGridStyled = styled.div`
  // ${props => props.columns && css`
  //   -moz-column-count: ${props.columns}; 
  //   -webkit-column-count: ${props.columns}; 
  //   column-count: ${props.columns};
  //   -moz-column-gap: 1em;
  //   -webkit-column-gap: 1em; 
  //   column-gap: 1em;
  // `}
  //
  // > div {
  //    display: inline-block;
  //    margin-bottom: 1em;
  //    width: 100%; 
  // }
`;


class MatchGrid extends React.Component {
  componentDidMount() {
    // this.props.getMatches();
  }

  renderGrid() {
    if (this.props.matches.length) {
      return this.props.matches.map(item => (
        <div>
          {/* <LazyLoad height={1000} key={item.id}>
            <MatchViewCompact data={item} isLoggedIn={this.props.isLoggedIn} />
          </LazyLoad> */}
          <MatchViewCompact data={item} isLoggedIn={this.props.isLoggedIn} />
        </div>
      ));
    }

    if (this.props.loading) {
      return (<MatchGridBlank />);
    }

    return null;
  }

  render() {
    return (
      <PostsGridStyled>
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
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  matches: state.app.matches.data,
  loading: state.app.matches.loading,
});

export default connect(mapStateToProps)(MatchGrid);
