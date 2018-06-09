import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardActions,
  CardMedia,
} from 'material-ui';
import FanFight from './components/FanFightVisualize';
import clubs from '../../fxconstants/clubsObj.json';
import { hitVote, getMatchComments, announce } from '../../actions/index';
import strings from '../../lang/index';
import { bindAll, getCookie, styles } from '../../utils/index';
import constants from '../constants';
import CreateComment from './components/Discussion/CreateEditComment';
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
          <CardMedia
            style={{
              textAlign: 'center',
            }}
          >
            <div>
              <div>
                <FanFight
                  homeColor={homeColor}
                  awayColor={awayColor}
                  homeFan={homeVotes}
                  awayFan={awayVotes}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: 20,
                }}
              >
                <div>{home.name}</div>
                <div>Or</div>
                <div>{away.name}</div>
              </div>
              {this.state.openLive && (
                <div style={{ width: '100%', backgroundColor: 'black' }}>
                  <iframe
                    title={this.props.data.id}
                    src={this.props.data.url_live}
                    width="590"
                    height="431"
                    frameBorder="0"
                    scrolling="no"
                    // allow="autoplay"
                    allowFullScreen
                    // webkitAllowFullScreen
                    // mozAllowFullScreen
                    // oAllowFullScreen
                    // msAllowFullScreen
                  />
                </div>
              )}
            </div>
          </CardMedia>
          <CardActions
            style={{
              padding: '0 8px',
              display: 'flex',
              flexDirection: 'row',
              borderTop: `1px solid ${constants.grey50}`,
              fontWeight: constants.fontWeightHeavy,
            }}
          >
            <MatchActions
              type="post"
              data={this.props.data}
              disableComment
              isLoggedIn={this.props.isLoggedIn}
              count={this.props.comments.length}
              onClickOpenLive={() => {
                this.setState({ openLive: !this.state.openLive });
              }}
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
  matchID: PropTypes.number,
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

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
