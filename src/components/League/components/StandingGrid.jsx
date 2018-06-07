import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardTitle, List, ListItem } from 'material-ui';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { MatchGridBlank } from '../../Blank';
import constants from '../../constants';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import clubsObj from '../../../fxconstants/clubsObj.json';
import { styles } from '../../../utils';

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

class StandingGrid extends React.Component {
  componentDidMount() {
    // getData(this.props);
  }

  getSeasonName = (seasonID) => {
    const fs = this.props.seasons.find(s => s.id === Number(seasonID));

    if (fs) {
      return fs.name;
    }
    return null;
  };

  renderGrid() {
    const {
      loading, standings, leagueID,
    } = this.props;

    const standingsOut = standings;

    if (standingsOut && standingsOut.length) {
      const groups = {};
      standingsOut.forEach((el) => {
        if (groups[el.season_id]) {
          groups[el.season_id].push(el);
        } else {
          groups[el.season_id] = [el];
        }
      });

      return Object.keys(groups).map(seasonID => (
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
            <img
              src={leaguesObj[leagueID] && leaguesObj[leagueID].icon}
              alt=""
              height={18}
            />
            &nbsp;&nbsp;
            {this.getSeasonName(seasonID) || (leaguesObj[leagueID] && leaguesObj[leagueID].name)}
          </CardTitle>
          <Table
            selectable={false}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>#</TableHeaderColumn>
                <TableHeaderColumn>{this.getSeasonName(seasonID) || (leaguesObj[leagueID] && leaguesObj[leagueID].name)}</TableHeaderColumn>
                <TableHeaderColumn>P</TableHeaderColumn>
                <TableHeaderColumn>W</TableHeaderColumn>
                <TableHeaderColumn>D</TableHeaderColumn>
                <TableHeaderColumn>L</TableHeaderColumn>
                <TableHeaderColumn>F</TableHeaderColumn>
                <TableHeaderColumn>A</TableHeaderColumn>
                <TableHeaderColumn>G</TableHeaderColumn>
                <TableHeaderColumn>D</TableHeaderColumn>
                <TableHeaderColumn>Pts</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups[seasonID].map((item, index) => (
                <TableRow>
                  <TableRowColumn>{index + 1}</TableRowColumn>
                  <TableRowColumn>{clubsObj[item.club_id] && clubsObj[item.club_id].name}</TableRowColumn>
                  <TableRowColumn>{item.p}</TableRowColumn>
                  <TableRowColumn>{item.w}</TableRowColumn>
                  <TableRowColumn>{item.d}</TableRowColumn>
                  <TableRowColumn>{item.l}</TableRowColumn>
                  <TableRowColumn>{item.f}</TableRowColumn>
                  <TableRowColumn>{item.a}</TableRowColumn>
                  <TableRowColumn>{item.gd}</TableRowColumn>
                  <TableRowColumn>{item.d}</TableRowColumn>
                  <TableRowColumn>{item.pts}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <List style={{ padding: 0 }}>
            {groups[seasonID].map((item) => {
              const matchVisualize = (
                <div>
                  {/* <MatchVisualizeCompact
                      disabled
                      data={item}
                      isLoggedIn={this.props.isLoggedIn}
                      greaterThan={this.props.greaterThan}
                    /> */}
                  {JSON.stringify(item)}
                </div>
              );
              return (
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
            })}
          </List>
        </Card>
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

StandingGrid.propTypes = {
  leagueID: PropTypes.number, /* null if view all */
  seasons: PropTypes.array,
  standings: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,

  /**/
  // user: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(connect()(StandingGrid));
