import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import { Card, CardTitle, List, ListItem } from 'material-ui';
import { MatchGridBlank } from '../../Blank';
import constants from '../../constants';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import { styles, toDateString } from '../../../utils';
import MatchVisualizeCompact from './MatchVisualizeCompact';

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

class MatchGrid extends React.Component {
  componentDidMount() {
    // getData(this.props);
  }

  getSeasonName = (seasonID) => {
    const fs = this.props.seasons.find(s => s.id === Number(seasonID));
    window.seasons = this.props.seasons;
    if (fs) {
      return fs.name;
    }
    return null;
  };

  renderGrid() {
    const {
      loading, matches, leagueID,
    } = this.props;

    let matchesOut = matches;
    if (leagueID) {
      matchesOut = matchesOut.filter(m => m.league_id === leagueID);
    }

    const groups = {};
    matchesOut.forEach((match) => {
      const date = toDateString(match.date * 1000);
      if (groups[date]) {
        if (groups[date][match.season_id]) {
          groups[date][match.season_id].push(match);
        } else {
          groups[date][match.season_id] = [match];
        }
      } else {
        groups[date] = {};
        groups[date][match.season_id] = [match];
      }
    });

    if (matchesOut.length) {
      return Object.keys(groups).map(date => (
        <div key={date}>
          <h5 className="date">{date}</h5>
          {Object.keys(groups[date]).map(seasonID => (
            <Card
              key={seasonID}
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
                <img src={leaguesObj[leagueID] && leaguesObj[leagueID].icon} alt="" height={18} />&nbsp;&nbsp;{this.getSeasonName(seasonID)}
              </CardTitle>
              <List style={{ padding: 0 }}>
                {groups[date][seasonID].map((item, index) => {
                  if (index > 10) {
                    return (
                      <ListItem
                        key={`match_${item.id}`}
                        onClick={() => {
                          this.props.history.push(`/m/${item.id}`);
                        }}
                        innerDivStyle={{ padding: 0 }}
                      >
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
                    <ListItem
                      key={`match_${item.id}`}
                      innerDivStyle={{ padding: 0 }}
                      onClick={() => {
                        this.props.history.push(`/m/${item.id}`);
                      }}
                    >
                      <MatchVisualizeCompact
                        disabled
                        data={item}
                        isLoggedIn={this.props.isLoggedIn}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          ))}
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

MatchGrid.propTypes = {
  leagueID: PropTypes.number, /* null if view all */

  /**/
  // user: PropTypes.object,
  history: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  matches: PropTypes.array,
  seasons: PropTypes.array,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  seasons: state.app.seasons.data,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  matches: state.app.matches.data,
  loading: state.app.matches.loading,
});

export default withRouter(connect(mapStateToProps)(MatchGrid));
