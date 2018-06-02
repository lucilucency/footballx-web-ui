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
import clubs from 'fxconstants/build/clubsObj.json';
import { hitVote, getMatchComments, announce } from '../../../actions';
import strings from '../../../lang';
import { bindAll, getCookie } from '../../../utils';
import constants from '../../constants';
import MatchVisualize from './MatchVisualize';
import FanFight from './FanFight';
import Backdrop from './Backdrop';
import CreateComment from './CreateEditMatchComment';
import ViewComments from './MatchComments';
import MatchActions from './MatchActions';

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
          style={{
            // maxWidth: 900,
          }}
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
                <FanFight
                  homeColor={homeColor}
                  awayColor={awayColor}
                  homeFan={homeVotes}
                  awayFan={awayVotes}
                />
                <MatchVisualize
                  matchID={this.props.data.id}
                  home={home}
                  away={away}
                  homeVotes={homeVotes}
                  awayVotes={awayVotes}
                  date={data.date}
                  isLoggedIn={this.props.isLoggedIn}
                  pumping
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
              {!this.state.openLive && (
                <Backdrop
                  home={homeID}
                  homeVotes={homeVotes}
                  away={awayID}
                  awayVotes={awayVotes}
                />
              )}
              {this.state.openLive && (
                <iframe
                  title={this.props.data.id}
                  src="//iframe.dacast.com/b/111717/c/472596"
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