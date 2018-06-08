import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import { SmallPaper } from '../../../utils/index';
// import strings from '../../../lang';
import leagues from '../../../fxconstants/leaguesObj.json';

const Styled = styled.div`
  text-align: left;
`;

const LeagueHeader = ({ leagueID }) => (
  <Styled>
    <h4>{leagues[leagueID] && leagues[leagueID].name}</h4>
  </Styled>
);

LeagueHeader.propTypes = {
  leagueID: PropTypes.number,
};

// const mapStateToProps = state => ({
//   user: state.app.metadata.data.user || {},
// });

export default connect()(LeagueHeader);
