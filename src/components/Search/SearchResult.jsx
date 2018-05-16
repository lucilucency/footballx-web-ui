import React from 'react';
import PropTypes from 'prop-types';
import strings from '../../lang';
import Container from '../Container';

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
      {JSON.stringify(pros)}
    </Container>
    <Container
      loading={playersLoading}
      error={playersError}
      title={strings.app_public_players}
      subtitle={`${players.length} ${strings.app_results}`}
    >
      {JSON.stringify(players)}
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
