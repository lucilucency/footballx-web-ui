/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardMedia } from 'material-ui';
import clubs from '../../../fxconstants/clubsObj.json';
// import { upVote, downVote, updateMatch } from '../../../actions/index';
import { bindAll } from '../../../utils/index';
import constants from '../../constants';
import MatchVisualizeCompact from './MatchVisualizeCompact';


class MatchViewCompact extends React.Component {
  static initialState = {
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...MatchViewCompact.initialState,
    };

    bindAll([], this);
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
        key={data.id}
      >
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
            matchID={this.props.data.id}
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
