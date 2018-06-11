import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import { Card, CardTitle, List, ListItem } from 'material-ui';
import { MatchGridBlank } from '../../Blank';
import ui from '../../../theme';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import { styles, toDateString } from '../../../utils';
import MatchVisualizeCompact from './MatchVisualizeCompact';

const Styled = styled.div`
  .date {
    text-align: left;
  }
  // background-color: ${ui.surfaceColorPrimary};
  
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

  getHeaderName = (seasonID, leagueID) => {
    const fs = this.props.seasons.find(s => s.id === Number(seasonID));
    if (fs) {
      return fs.name;
    }
    return leaguesObj[leagueID] && leaguesObj[leagueID].name;
  };

  getHeaderImage = leagueID => (<img src={leaguesObj[leagueID] && leaguesObj[leagueID].icon} alt="" height={18} />);

  renderGrid() {
    const {
      loading, matches, leagueID,
    } = this.props;

    let matchesOut = matches;
    if (leagueID) {
      matchesOut = matchesOut.filter(m => Number(m.league_id) === leagueID);
    }

    if (matchesOut && matchesOut.length) {
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
                textColor: ui.textColorSecondary,
              }}
            >
              <CardTitle
                style={{
                  ...styles.cardTitle.style,
                  paddingLeft: 0,
                  borderBottom: `1px solid ${ui.borderColor}`,
                }}
              >
                {this.getHeaderImage(leagueID || (groups[date][seasonID] && groups[date][seasonID].length && groups[date][seasonID][0].league_id))}
                &nbsp;&nbsp;
                {this.getHeaderName(seasonID, groups[date][seasonID] && groups[date][seasonID].length && groups[date][seasonID][0].league_id)}
              </CardTitle>
              <List style={{ padding: 0 }}>
                {groups[date][seasonID].map((item, index) => {
                  const matchVisualize = (
                    <MatchVisualizeCompact
                      disabled
                      data={item}
                      isLoggedIn={this.props.isLoggedIn}
                      greaterThan={this.props.greaterThan}
                    />
                  );
                  const matchVisualizeItem = (
                    <ListItem
                      key={`match_${item.id}`}
                      innerDivStyle={{ padding: 0 }}
                      onClick={() => {
                        this.props.history.push(`/m/${item.id}`);
                      }}
                    >
                      {matchVisualize}
                    </ListItem>
                  );

                  if (index > 10) {
                    return (
                      <LazyLoad height={200} key={`match_${item.id}`}>
                        {matchVisualizeItem}
                      </LazyLoad>
                    );
                  }
                  return matchVisualizeItem;
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
  matches: PropTypes.array.isRequired,
  seasons: PropTypes.array,

  /**/
  // user: PropTypes.object,
  history: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  loading: PropTypes.bool,
  greaterThan: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  loading: state.app.matches.loading,
  greaterThan: state.browser.greaterThan,
});

export default withRouter(connect(mapStateToProps)(MatchGrid));
