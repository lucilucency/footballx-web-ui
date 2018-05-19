/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import clubs from 'fxconstants/build/clubsObj.json';
import { IconUpvote } from '../../Icons';
import { hitVote } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, bindAll, ActiveLink, MutedLink } from '../../../utils';
import constants from '../../constants';
import MatchVisualize from './MatchVisualize';
import FanFight from './FanFight';

const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

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
    this.props.hitVote(this.props.data.id, home, {
      votes: {
        [home]: homeVotes + 1,
        [away]: awayVotes,
      },
    });
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
    const userLink = <MutedLink to={`/u/${data.xuser_id}`}>{data.xuser_username || data.xuser_nickname}</MutedLink>;
    const postLink = (
      <MutedLink
        to={{
          pathname: `/p/${data.id}`,
          state: {
            data,
          },
        }}
      >
        {toDateTimeString(data.created_at)}
      </MutedLink>
    );

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
        {null && (
          <CardHeader
            title={<ActiveLink to={`/r/${data.community_link}`}>{data.community_name}</ActiveLink>}
            subtitle={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
            avatar={data.community_icon}
            style={{ padding: '1em 1em 0.5em 1em' }}
          />
        )}
        <CardTitle
          title={data.title}
          titleColor={constants.theme().textColorPrimary}
          titleStyle={{
            fontWeight: constants.fontWeightHeavy,
            fontSize: constants.fontSizeBig,
            lineHeight: 1.44,
          }}
          style={{
            paddingTop: 0,
            wordBreak: 'break-word',
          }}
        />
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
                  disabled={!this.props.isLoggedIn}
                  iconStyle={{
                    width: 32,
                    height: 32,
                  }}
                >
                  <IconUpvote color={constants.theme().buttonMute} hoverColor={homeColor} />
                </IconButton>
                <IconButton
                  tooltip={`For ${awayName}`}
                  tooltipPosition="top-center"
                  onClick={() => this.hitVoteAway(home, away, homeVotes, awayVotes)}
                  disabled={!this.props.isLoggedIn}
                  iconStyle={{
                    width: 32,
                    height: 32,
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
        {(data.content_type === 1 || data.content_type === 3) && (
          <CardText
            style={{
              fontSize: constants.fontSizeMedium,
              // whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {data.content_type === 3 ? <a href={`${data.content}`} target="_blank">{data.content}</a> : data.content}
          </CardText>
        )}
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
            <FlatButton
              target="_blank"
              label="Share"
              // icon={<IconShare color={constants.theme().buttonMute} hoverColor={constants.blueA100} style={{}} />}
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
        </CardActions>
      </Card>
    );
  }
}

ViewMatchCompactFull.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  hitVote: PropTypes.func,
  // history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompactFull));
