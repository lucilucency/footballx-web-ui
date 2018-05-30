/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardMedia } from 'material-ui';
import clubs from 'fxconstants/build/clubsObj.json';
import { upVote, downVote, getMatchVotes, updateMatch } from '../../../actions';
import { bindAll } from '../../../utils';
import constants from '../../constants';
import MatchVisualizeCompact from './MatchVisualizeCompact';
import FanFight from './FanFight';
// import MatchActions from './MatchActions';


class ViewMatchCompact extends React.Component {
  static initialState = {
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewMatchCompact.initialState,
    };

    bindAll([], this);
  }

  componentDidMount() {
    this.props.getMatchVotes(this.props.data.id, (resp) => {
      this.props.updateMatch({
        ...this.props.data,
        ...resp,
      });
    });
  }

  upvote = () => {
    if (this.props.isLoggedIn) {
      let { c_ups = 0, c_downs = 0, vflag = 0 } = this.props.data;
      if (vflag === 1) {
        vflag = 0;
        c_ups -= 1;
      } else if (vflag === 0) {
        vflag = 1;
        c_ups += 1;
      } else if (vflag === -1) {
        vflag = 1;
        c_ups += 1;
        c_downs -= 1;
      }

      const payload = {
        ...this.props.data,
        vflag,
        c_ups,
        c_downs,
      };

      this.props.upVote(this.props.data.id, {
        payload,
      });
    }
  };

  downVote = () => {
    if (this.props.isLoggedIn) {
      let { c_ups = 0, c_downs = 0, vflag = 0 } = this.props.data;
      if (vflag === 1) {
        vflag = -1;
        c_ups -= 1;
        c_downs += 1;
      } else if (vflag === 0) {
        vflag = -1;
        c_downs += 1;
      } else if (vflag === -1) {
        vflag = 0;
        c_downs -= 1;
      }

      const payload = {
        ...this.props.data,
        vflag,
        c_ups,
        c_downs,
      };

      this.props.downVote(this.props.data.id, {
        payload,
      });
    }
  };

  render() {
    const { data } = this.props;
    const { home: homeID, away: awayID } = data;
    const homeVotes = data.votes && data.votes[data.home];
    const awayVotes = data.votes && data.votes[data.away];
    const home = clubs[homeID] || {};
    const away = clubs[awayID] || {};
    const winner = homeVotes > awayVotes ? home : away;
    const homeColor = home.home_color || constants.redA200;
    const awayColor = away.home_color || constants.blueA200;

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
          <div>
            <div
              style={{
                backgroundImage: 'url(/assets/images/backdrops/stadium.jpg)',
                backgroundColorPrimary: 'black',
                backgroundSize: 'cover',
                display: 'block',
                height: 300,
                width: '100%',
                position: 'absolute',
                // filter: 'blur(2px)',
                zIndex: 0,
              }}
            />
            <div>
              <MatchVisualizeCompact
                disabled
                matchID={this.props.data.id}
                home={home}
                away={away}
                homeVotes={homeVotes}
                awayVotes={awayVotes}
                date={data.date}
                isLoggedIn={this.props.isLoggedIn}
              />
              <FanFight
                homeColor={homeColor}
                awayColor={awayColor}
                homeFan={homeVotes}
                awayFan={awayVotes}
                winner={winner.name}
              />
            </div>
          </div>
        </CardMedia>
        {/* <CardActions
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
            disableComment={false}
            isLoggedIn={this.props.isLoggedIn}
          />
        </CardActions> */}
      </Card>
    );
  }
}

ViewMatchCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  getMatchVotes: PropTypes.func,
  updateMatch: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
  getMatchVotes: (matchID, args) => dispatch(getMatchVotes(matchID, args)),
  updateMatch: payload => dispatch(updateMatch(payload)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompact));
