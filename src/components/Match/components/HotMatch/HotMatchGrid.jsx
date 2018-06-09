import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import LazyLoad from 'react-lazyload';
import { getHotMatches } from '../../../../actions/index';
import HotMatchViewCompact from './HotMatchViewCompact';
import { MatchGridBlank } from '../../../Blank';
// import constants from '../../constants';

const Styled = styled.div`
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


class HotMatchGrid extends React.Component {
  componentDidMount() {
    this.props.getHotMatches();
  }

  renderGrid() {
    if (this.props.matches.length) {
      return this.props.matches.map(item => (
        <LazyLoad height={200} key={item.id}>
          <HotMatchViewCompact data={item} isLoggedIn={this.props.isLoggedIn} />
        </LazyLoad>
      ));
    }

    if (this.props.loading) {
      return (<MatchGridBlank />);
    }

    return null;
  }

  render() {
    return (
      <Styled columns={this.columnCount}>
        {this.renderGrid()}
      </Styled>
    );
  }
}

HotMatchGrid.propTypes = {
  // sorting: PropTypes.string,
  // filter: PropTypes.string,

  /**/
  // user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  matches: PropTypes.array,
  loading: PropTypes.bool,
  getHotMatches: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  matches: state.app.hotMatches.data,
  loading: state.app.hotMatches.loading,
});

const mapDispatchToProps = dispatch => ({
  getHotMatches: () => dispatch(getHotMatches()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotMatchGrid);
