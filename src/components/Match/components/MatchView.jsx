import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardMedia,
} from 'material-ui';
import clubs from '../../../fxconstants/clubsObj.json';
import { announce } from '../../../actions/index';
import strings from '../../../lang/index';
import { bindAll, styles } from '../../../utils/index';
import MatchVisualize from './MatchVisualize';

class MatchView extends React.Component {
  static initialState = {
    openLive: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...MatchView.initialState,
    };

    bindAll([], this);
  }

  componentDidMount() {
    this.props.announce({
      message: strings.announce_match_vote,
    });
  }

  render() {
    const { data } = this.props;

    const { home: homeID, away: awayID } = data;
    const homeVotes = data.votes && data.votes[data.home];
    const awayVotes = data.votes && data.votes[data.away];
    const home = clubs[homeID] || {};
    const away = clubs[awayID] || {};
    return (
      <div>
        <Card
          key={data.id}
          style={styles.card.style}
        >
          <CardMedia
            style={{
              textAlign: 'center',
            }}
          >
            <div>
              <div>
                <MatchVisualize
                  matchID={this.props.data.id}
                  home={home}
                  away={away}
                  homeVotes={homeVotes}
                  awayVotes={awayVotes}
                  date={data.date}
                  isLoggedIn={this.props.isLoggedIn}
                  // pumping
                />
              </div>
            </div>
          </CardMedia>
        </Card>
      </div>
    );
  }
}

MatchView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  announce: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
});


export default withRouter(connect(null, mapDispatchToProps)(MatchView));
