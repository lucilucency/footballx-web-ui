/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';

import { IconUpvote, IconDownvote } from '../../Icons';
import { upVote, downVote, getMatchVotes } from '../../../actions';
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
`;

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
    this.props.getMatchVotes(this.props.data.id);
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
    const ups = data.c_ups || 0;
    const downs = data.c_downs || 0;

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
            // paddingBottom: 0,
            // whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
        <CardMedia
          style={{
            textAlign: 'center',
          }}
          onClick={() => {
            this.props.history.push(`/m/${this.props.data.id}`);
          }}
        >
          <div>
            <MatchVisualize
              home={data.home}
              away={data.away}
              date={data.date}
            />
            <FanFight
              home={data.home}
              away={data.away}
              homeFan={data.homeFan}
              awayFan={data.awayFan}
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
          {null && (
            <ActionModule>
              <IconButton
                tooltip="Upvote"
                tooltipPosition="top-center"
                onClick={this.upvote}
                disabled={!this.props.isLoggedIn}
                iconStyle={{
                  width: 32,
                  height: 32,
                }}
              >
                <IconUpvote color={data.vflag === 1 ? constants.blueA100 : constants.theme().buttonMute} hoverColor={constants.blueA100} />
              </IconButton>
              <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{ups - downs}</small>
              <IconButton
                tooltip="Downvote"
                tooltipPosition="top-center"
                onClick={this.downVote}
                disabled={!this.props.isLoggedIn}
                iconStyle={{
                  width: 32,
                  height: 32,
                }}
              >
                <IconDownvote color={data.vflag === -1 ? constants.redA100 : constants.theme().buttonMute} hoverColor={constants.redA100} />
              </IconButton>
            </ActionModule>
          )}
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
              onClick={() => this.props.history.push(`/m/${this.props.data.id}`)}
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

ViewMatchCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  getMatchVotes: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
  getMatchVotes: matchID => dispatch(getMatchVotes(matchID)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompact));
