import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardActions,
  CardMedia,
} from 'material-ui';
import clubs from '../../fxconstants/clubsObj.json';
import { hitVote, getMatchComments, announce } from '../../actions/index';
import strings from '../../lang/index';
import { bindAll, getCookie, styles } from '../../utils/index';
import constants from '../constants';

import { FanFightVisualize, FanFightActions } from './components';
import CreateComment from './components/Discussion/CreateEditMatchComment';
import ViewComments from './components/Discussion/Comments';
import MatchActions from './components/Discussion/DiscussionTools';

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
    this.props.getMatchComments(this.props.matchID || this.props.data.id, 'hot', getCookie('user_id'));
  }

  render() {
    const { data } = this.props;

    const { home: homeID, away: awayID } = data;
    const homeVotes = data.votes && data.votes[data.home];
    const awayVotes = data.votes && data.votes[data.away];
    const home = clubs[homeID] || {};
    const away = clubs[awayID] || {};
    const homeColor = home.home_color || constants.redA200;
    const awayColor = away.home_color || constants.blueA200;
    return (
      <div>
        <Card
          key={data.id}
          style={styles.card.style}
        >
          <CardHeader
            title={strings.paragraph_match_title}
            style={{ textAlign: 'center' }}
            textStyle={{
              padding: 0,
              textTransform: 'uppercase',
            }}
          />
          <CardMedia
            style={{
              textAlign: 'center',
            }}
          >
            <div>
              <div>
                <FanFightActions
                  matchID={this.props.data.id}
                  home={home}
                  away={away}
                  homeVotes={homeVotes}
                  awayVotes={awayVotes}
                  date={data.date}
                  isLoggedIn={this.props.isLoggedIn}
                  pumping
                />
                <FanFightVisualize
                  homeColor={homeColor}
                  awayColor={awayColor}
                  homeFan={homeVotes}
                  awayFan={awayVotes}
                />
              </div>
            </div>
          </CardMedia>
          <CardActions
            style={styles.cardActions.style}
          >
            <MatchActions
              type="post"
              data={this.props.data}
              disableComment
              isLoggedIn={this.props.isLoggedIn}
              count={this.props.comments.length}
            />
          </CardActions>
        </Card>
        {this.props.isLoggedIn && <CreateComment post={this.props.data} />}
        <ViewComments comments={this.props.comments} isLoggedIn={this.props.isLoggedIn} />
      </div>
    );
  }
}

MatchView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  matchID: PropTypes.number,

  /**/
  // user: PropTypes.object,
  comments: PropTypes.array,
  getMatchComments: PropTypes.func,
  announce: PropTypes.func,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
  comments: state.app.comments.data,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
  getMatchComments: (postID, sortby, xuser_id) => dispatch(getMatchComments(postID, sortby, xuser_id)),
  announce: props => dispatch(announce(props)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchView));
