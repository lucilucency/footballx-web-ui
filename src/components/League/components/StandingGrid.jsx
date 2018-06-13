import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardTitle } from 'material-ui';

import Table, { /* TableLink */ } from '../../Table';
import { MatchGridBlank } from '../../Blank';
import ui from '../../../theme';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import clubsObj from '../../../fxconstants/clubsObj.json';
import { styles, getOrdinal } from '../../../utils';

const Styled = styled.div`
  //display: grid;
  //grid-template-columns: 1fr;
  //grid-column-gap: 1em;
  //
  //@media only screen and (min-width: 992px) {
  //  grid-template-columns: 1fr 1fr;
  //}
`;

const displayTeam = (row, col, field) => {
  const name = clubsObj[field] && clubsObj[field].name;
  const icon = clubsObj[field] && clubsObj[field].icon;

  return (
    <div>
      <img
        src={icon}
        alt=""
        height={18}
      />
      &nbsp;&nbsp;
      {name}
    </div>
  );
};

const tableEventsColumns = (name, browser) => [
  browser.greaterThan.medium && { displayName: '#', displayFn: (row, col, field, index) => getOrdinal(index + 1) },
  { displayName: name, field: 'club_id', displayFn: displayTeam },
  { displayName: 'P', field: 'p', sortFn: false },
  { displayName: 'W', field: 'w', sortFn: false },
  { displayName: 'D', field: 'd', sortFn: false },
  { displayName: 'L', field: 'l', sortFn: false },
  { displayName: 'F', field: 'f', sortFn: false },
  { displayName: 'A', field: 'd', sortFn: false },
  { displayName: 'G', field: 'gd', sortFn: false },
  { displayName: 'D', field: 'd', sortFn: false },
  { displayName: 'PTS', field: 'pts', sortFn: false },
];

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

    const standingsOut = standings.sort((pre, cur) => {
      if (pre.pts > cur.pts) {
        return -1;
      } else if (pre.pts === cur.pts) {
        return 0;
      }
      return 1;
    });

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
            textColor: ui.alternateTextColor,
          }}
        >
          {false && (
            <CardTitle
              style={{
                ...styles.cardTitle.style,
                paddingLeft: 0,
                borderBottom: `1px solid ${ui.borderColor}`,
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
          )}
          <Table
            columns={tableEventsColumns(this.getSeasonName(seasonID) || (leaguesObj[leagueID] && leaguesObj[leagueID].name), this.props.browser)}
            data={groups[seasonID]}
            loading={false}
            error={false}
            paginated={false}
            pageLength={30}
          />
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
  loading: PropTypes.bool,
  browser: PropTypes.object,

  /**/
  // user: PropTypes.object,
  // history: PropTypes.object,
};

export default withRouter(connect()(StandingGrid));
