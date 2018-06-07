import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import { Card, CardTitle, CardMedia, List, ListItem } from 'material-ui';
import { getSeasonMatches } from '../../../actions';
import { MatchGridBlank } from '../../Blank';
import constants from '../../constants';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import { styles, toDateString } from '../../../utils';
import MatchVisualizeCompact from './MatchVisualizeCompact';

const getData = (props) => {
  props.getSeasonMatches(props.season.id, {
    start_time: props.season.start_time,
    end_time: props.season.end_time,
  });
};

const Styled = styled.div`
  .date {
    text-align: left;
  }
  // background-color: ${constants.theme().surfaceColorPrimary};
  
  .league-preview {
    padding: 0 1em;
    display: flex;
    flex-direction: row;
  }
`;

class MatchesInSeason extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  renderGrid() {
    const {
      loading, matches, leagueID, season,
    } = this.props;

    // const seasonMatches = matches.filter(match => match.season_id === season.id);
    const seasonMatches = matches.filter(match => match.season_id === season.id);

    const groups = {};
    seasonMatches.forEach((match) => {
      if (groups[match.date]) {
        groups[match.date].push(match);
      } else {
        groups[match.date] = [match];
      }
    });

    if (seasonMatches.length) {
      return Object.keys(groups).map(date => (
        <div>
          <h4 className="date">{toDateString(date)}</h4>
          <Card
            key={date}
            style={{
              ...styles.card.style,
              padding: 8,
              marginBottom: 8,
              textColor: constants.theme().textColorSecondary,
            }}
          >
            <CardTitle
              style={{
                ...styles.cardTitle.style,
                paddingLeft: 0,
                borderBottom: `1px solid ${constants.theme().borderColor}`,
              }}
            >
              <img src={leaguesObj[leagueID] && leaguesObj[leagueID].icon} alt="" height={18} />&nbsp;&nbsp;{season.name || (leaguesObj[leagueID] && leaguesObj[leagueID].name)}
            </CardTitle>
            <CardMedia
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => {
                // this.props.history.push(`/m/${this.props.data.id}`);
              }}
            >
              <List>
                {groups[date].map((item, index) => {
                  if (index > 10) {
                    return (
                      <ListItem key={`match_${item.id}`}>
                        <LazyLoad height={200}>
                          <MatchVisualizeCompact
                            disabled
                            data={item}
                            isLoggedIn={this.props.isLoggedIn}
                          />
                        </LazyLoad>
                      </ListItem>
                    );
                  }
                  return (
                    <ListItem key={`match_${item.id}`}>
                      <MatchVisualizeCompact
                        disabled
                        data={item}
                        isLoggedIn={this.props.isLoggedIn}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardMedia>
          </Card>
        </div>
      ));
    }

    if (loading) {
      return (<MatchGridBlank />);
    }

    return null;
  }

  render() {
    return (
      <Styled>
        {this.renderGrid()}
      </Styled>
    );
  }
}

MatchesInSeason.propTypes = {
  leagueID: PropTypes.number,
  season: PropTypes.object.isRequired,

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
  getSeasonMatches: (seasonID, args) => dispatch(getSeasonMatches(seasonID, args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchesInSeason);
