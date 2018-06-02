import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import MatchViewCompact from './MatchViewCompact';
import { MatchGridBlank } from '../../Blank';
import constants from '../../constants';
import { getMatches } from '../../../actions';

const getData = (props) => {
  props.getMatches({
    start_time: props.start_time,
    end_time: props.end_time,
  });
};

const PostsGridStyled = styled.div`
  // background-color: ${constants.theme().surfaceColorPrimary};
  
  .league-preview {
    padding: 0 1em;
    display: flex;
    flex-direction: row;
  }
`;


class MatchGrid extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.start_time !== this.props.start_time || props.end_time !== this.props.end_time) {
      getData(props);
    }
  }

  renderGrid() {
    const {
      loading, isLoggedIn, grouped, matches,
    } = this.props;
    if (matches.length) {
      if (grouped) {
        const leagues = {};
        matches.forEach((match) => {
          if (leagues[match.league_id]) {
            leagues[match.league_id].push(match);
          } else {
            leagues[match.league_id] = [match];
          }
        });

        return Object.keys(leagues).map(key => (
          <div key={key}>
            {leagues[key].map((item, index) => {
              if (index > 10) {
                return (
                  <LazyLoad height={200} key={item.id}>
                    <MatchViewCompact data={item} isLoggedIn={isLoggedIn} />
                  </LazyLoad>
                );
              }
              return <MatchViewCompact key={item.id} data={item} isLoggedIn={isLoggedIn} />;
            })}
          </div>
        ));
      }
      return matches.map((item, index) => {
        if (index > 10) {
          return (
            <LazyLoad height={200} key={item.id}>
              <MatchViewCompact data={item} isLoggedIn={isLoggedIn} />
            </LazyLoad>
          );
        }
        return <MatchViewCompact key={item.id} data={item} isLoggedIn={isLoggedIn} />;
      });
    }

    if (loading) {
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
  start_time: PropTypes.number,
  end_time: PropTypes.number,
  grouped: PropTypes.bool,
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

const mapDispatchToProps = dispatch => ({
  getMatches: args => dispatch(getMatches(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchGrid);
