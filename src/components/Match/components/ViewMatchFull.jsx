/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardActions,
  // CardHeader,
  CardMedia,
  // CardTitle,
  // CardText,
} from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import clubs from 'fxconstants/build/clubsObj.json';
import { IconUpvote } from '../../Icons';
import { hitVote } from '../../../actions';
// import strings from '../../../lang';
import { bindAll } from '../../../utils';
import constants from '../../constants';
import MatchVisualize from './MatchVisualize';
import FanFight from './FanFight';
import ButtonShare from './ButtonShare';

const ActionModule = styled.div`
  display: flex; 
  flex-direction: row;
  margin-right: 5px;
  justify-content: space-around;
`;

class ViewMatchCompactFull extends React.Component {
  static initialState = {
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewMatchCompactFull.initialState,
    };

    bindAll([], this);
  }

  hitVoteHome = (home, away, homeVotes, awayVotes) => {
    if (this.props.isLoggedIn) {
      this.props.hitVote(this.props.data.id, home, {
        votes: {
          [home]: homeVotes + 1,
          [away]: awayVotes,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/m/${this.props.data.id}`,
          },
        },
      });
    }
  };

  hitVoteAway = (home, away, homeVotes, awayVotes) => {
    this.props.hitVote(this.props.data.id, away, {
      votes: {
        [home]: homeVotes,
        [away]: awayVotes + 1,
      },
    });
  };

  render() {
    const { data } = this.props;

    const { home, away } = data;
    const homeVotes = data.votes && data.votes[data.home];
    const awayVotes = data.votes && data.votes[data.away];
    const homeColor = (clubs[home] && clubs[home].home_color) || constants.redA200;
    const awayColor = (clubs[away] && clubs[away].home_color) || constants.blueA200;
    const homeName = clubs[home] && clubs[home].name;
    const awayName = clubs[away] && clubs[away].name;
    return (
      <Card
        key={data.id}
      >
        <CardMedia
          style={{
            textAlign: 'center',
          }}
        >
          <div>
            <div>
              <MatchVisualize
                home={home}
                away={away}
                date={data.date}
              />
              <FanFight
                homeColor={homeColor}
                awayColor={awayColor}
                homeFan={homeVotes}
                awayFan={awayVotes}
              />
              <ActionModule>
                <IconButton
                  tooltip={`For ${homeName}`}
                  tooltipPosition="top-center"
                  onClick={() => this.hitVoteHome(home, away, homeVotes, awayVotes)}
                  iconStyle={{
                    width: 40,
                    height: 40,
                  }}
                >
                  <IconUpvote color={constants.theme().buttonMute} hoverColor={homeColor} />
                </IconButton>
                <IconButton
                  tooltip={`For ${awayName}`}
                  tooltipPosition="top-center"
                  onClick={() => this.hitVoteAway(home, away, homeVotes, awayVotes)}
                  iconStyle={{
                    width: 40,
                    height: 40,
                  }}
                >
                  <IconUpvote color={constants.theme().buttonMute} hoverColor={awayColor} />
                </IconButton>
              </ActionModule>
            </div>
            <div
              style={{
                // position: 'absolute',
                width: '100%',
                paddingTop: '50%',
                position: 'relative', /* If you want text inside of it */
                background: 'url(/assets/images/vote_mu.png) scroll no-repeat center/cover',
                opacity: 0.9,
                filter: 'alpha(opacity=50)',
              }}
            />
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
          <ActionModule>
            <FlatButton
              target="_blank"
              label={data.c_comments ? `${data.c_comments} comments` : 'Comment'}
              style={{
                marginTop: 6,
                lineHeight: '32px',
                height: 34,
                minWidth: 60,
              }}
              labelStyle={{
                fontSize: constants.fontSizeSmall,
                paddingLeft: 5,
                paddingRight: 5,
                fontWeight: constants.fontWeightHeavy,
              }}
            />
          </ActionModule>
          <ActionModule>
            <ButtonShare clipboard={`${window.location.host}/p/${data.id}`} />
          </ActionModule>
        </CardActions>
      </Card>
    );
  }
}

ViewMatchCompactFull.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  // user: PropTypes.object,
  history: PropTypes.object,
  hitVote: PropTypes.func,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompactFull));
