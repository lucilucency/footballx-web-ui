import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardMedia, CardTitle } from 'material-ui';
// import { upVote, downVote, updateMatch } from '../../../actions/index';
import { styles } from '../../../utils/index';
import constants from '../../constants';
import MatchVisualizeCompact from './MatchVisualizeCompact';
import leaguesObj from '../../../fxconstants/leaguesObj.json';
import clubs from '../../../fxconstants/clubsObj.json';

class MatchViewCompact extends React.Component {
  static initialState = {
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...MatchViewCompact.initialState,
    };
  }

  componentDidMount() {

  }

  render() {
    const { data } = this.props;
    const { home: homeID, away: awayID } = data;
    const home = clubs[homeID] || {};
    const away = clubs[awayID] || {};

    return (
      <Card
        style={{
          ...styles.card.style,
          padding: 8,
          marginBottom: 8,
        }}
      >
        <CardTitle
          style={{
            ...styles.cardTitle.style,
            borderBottom: `1px solid ${constants.theme().borderColor}`,
          }}
        >
          <img src={leaguesObj[data.league_id] && leaguesObj[data.league_id].icon} alt="" height={18} />
          {leaguesObj[data.league_id] && leaguesObj[data.league_id].name}
        </CardTitle>
        <CardMedia
          style={{
            textAlign: 'center',
            overflow: 'hidden',
            textColor: constants.theme().textColorSecondary,
            cursor: 'pointer',
          }}
          onClick={() => {
            this.props.history.push(`/m/${this.props.data.id}`);
          }}
        >
          <MatchVisualizeCompact
            disabled
            data={this.props.data}
            home={home}
            away={away}
            date={data.date}
            isLoggedIn={this.props.isLoggedIn}
          />
        </CardMedia>
      </Card>
    );
  }
}

MatchViewCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

export default withRouter(connect(mapStateToProps)(MatchViewCompact));
