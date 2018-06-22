import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from 'material-ui';

import Table, { /* TableLink */ } from '../../Table';
import { MatchGridBlank } from '../../Blank';
import ui from '../../../theme';
import strings from '../../../lang';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import clubsObj from '../../../fxconstants/clubsObj.json';
import { styles, getOrdinal } from '../../../utils';

const Styled = styled.div`

`;

const displayTeam = (row, col, field) => {
  const name = clubsObj[field] && clubsObj[field].name;
  const icon = clubsObj[field] && clubsObj[field].icon;

  return (
    <div>
      <img
        src={icon}
        alt=""
        height={24}
        style={{ verticalAlign: 'middle' }}
      />
      <span style={{ verticalAlign: 'middle' }}>&nbsp;&nbsp;{name}</span>
    </div>
  );
};

const displayStat = (row, col, field) => (field || '0');

const tableEventsColumns = (name, browser) => [
  browser.greaterThan.medium && { displayName: '#', displayFn: (row, col, field, index) => (index > -1 ? index + 1 : getOrdinal(index + 1)) },
  {
    displayName: <b>{name}</b>, field: 'club_id', displayFn: displayTeam, tooltip: strings.tooltip_team,
  },
  {
    displayName: <b>{strings.enum_standing_p}</b>, field: 'p', displayFn: displayStat, tooltip: strings.tooltip_standing_p,
  },
  {
    displayName: <b>{strings.enum_standing_w}</b>, field: 'w', displayFn: displayStat, tooltip: strings.tooltip_standing_w,
  },
  {
    displayName: <b>{strings.enum_standing_d}</b>, field: 'd', displayFn: displayStat, tooltip: strings.tooltip_standing_d,
  },
  {
    displayName: <b>{strings.enum_standing_l}</b>, field: 'l', displayFn: displayStat, tooltip: strings.tooltip_standing_l,
  },
  browser.greaterThan.medium && {
    displayName: <b>{strings.enum_standing_f}</b>, field: 'f', displayFn: displayStat, tooltip: strings.tooltip_standing_f,
  },
  browser.greaterThan.medium && {
    displayName: <b>{strings.enum_standing_a}</b>, field: 'a', displayFn: displayStat, tooltip: strings.tooltip_standing_a,
  },
  {
    displayName: <b>{strings.enum_standing_gd}</b>, field: 'gd', displayFn: displayStat, tooltip: strings.tooltip_standing_gd,
  },
  {
    displayName: <b>{strings.enum_standing_pts}</b>, field: 'pts', displayFn: displayStat, tooltip: strings.tooltip_standing_pts,
  },
].filter(Boolean);

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

    const sortedStandings = standings.sort((pre, cur) => {
      if (pre.pts > cur.pts) {
        return -1;
      } else if (pre.pts === cur.pts) {
        return 0;
      }
      return 1;
    });

    if (sortedStandings && sortedStandings.length) {
      const groups = {};
      sortedStandings.forEach((el) => {
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
          <Table
            columns={tableEventsColumns(this.getSeasonName(seasonID) || (leaguesObj[leagueID] && leaguesObj[leagueID].name), this.props.browser)}
            data={groups[seasonID].sort((a, b) => {
              if (a.rank > b.rank) return 1;
              else if (a.rank < b.rank) return -1;
              return 0;
            })}
            loading={false}
            error={false}
            paginated={false}
            pageLength={30}
            fixedColumns={this.props.browser.greaterThan.medium && [{
              pos: 2,
              width: '100px',
            }]}
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
