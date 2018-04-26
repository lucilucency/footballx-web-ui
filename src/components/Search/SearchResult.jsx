import React from 'react';
import PropTypes from 'prop-types';
import strings from '../../lang';
import { fromNow } from '../../utils';
import Table, { TableLink } from '../Table';
import Container from '../Container';
import { TableHeroImage } from '../Visualizations';

const searchColumns = [{
  displayName: strings.th_name,
  field: 'personaname',
  displayFn: (row) => {
    const subtitle = row.last_match_time ? fromNow(new Date(row.last_match_time) / 1000) : '';
    return (<TableHeroImage
      image={row.avatar || row.avatarfull}
      title={row.name || row.personaname}
      subtitle={subtitle}
      registered={row.last_login}
      accountId={row.account_id}
    />);
  },
}];

const proColumns = [{
  displayName: strings.th_name,
  field: 'name',
}, {
  displayName: strings.th_team_name,
  field: 'team_name',
  displayFn: (row, col, field) => (
    <TableLink to={`/teams/${row.team_id}`}>{field || strings.general_unknown}</TableLink>
  ),
}];

const Search = ({
  players,
  playersLoading,
  playersError,
  pros,
  prosLoading,
  prosError,
}) => (
  <div>
    <Container
      loading={prosLoading}
      error={prosError}
      title={strings.app_pro_players}
      hide={!pros || pros.length === 0}
    >
      <Table
        paginated
        pageLength={5}
        data={pros}
        columns={proColumns}
      />
    </Container>
    <Container
      loading={playersLoading}
      error={playersError}
      title={strings.app_public_players}
      subtitle={`${players.length} ${strings.app_results}`}
    >
      <Table
        paginated
        data={players}
        columns={searchColumns}
      />
    </Container>
  </div>
);

Search.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({})),
  playersLoading: PropTypes.bool,
  playersError: PropTypes.string,
  pros: PropTypes.arrayOf(PropTypes.shape({})),
  prosLoading: PropTypes.bool,
  prosError: PropTypes.string,
};

export default Search;
