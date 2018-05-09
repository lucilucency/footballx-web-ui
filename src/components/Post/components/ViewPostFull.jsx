import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, FlatButton, IconButton } from 'material-ui';
import IconUp from 'material-ui/svg-icons/action/thumb-up';
import IconDown from 'material-ui/svg-icons/action/thumb-down';
import { getPostComments, upVote, downVote } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, getCookie, MutedLink, ActiveLink } from '../../../utils';
import constants from '../../constants';
import ViewPostComments from './ViewPostComments';
import CreateComment from './CreateEditComment';

const ActionModule = styled.div`
  display: flex; 
  flex-direction: row;
  margin-right: 5px;
`;

const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

class ViewPostFull extends React.Component {
  static initialState = {
    formData: {
      comment: '',
      error: {},
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewPostFull.initialState,
    };
  }

  componentDidMount() {
    Promise.all([this.props.getPostComments(this.props.data.id, 'hot', getCookie('user_id'))])
      .then(() => {
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
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
    const item = this.props.data;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_nickname}</MutedLink>;
    const postLink = <MutedLink to={`/p/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
      <div>
        <Card
          key={item.id}
        >
          <CardHeader
            title={<ActiveLink to={`/r/${item.community_link}`}>{item.community_name}</ActiveLink>}
            subtitle={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
            avatar={item.community_icon}
            style={{ padding: '1em 1em 0.5em 1em' }}
          />
          {item.content_type === 2 &&
          <CardMedia
            overlay={<CardTitle
              title={item.title}
              titleColor={constants.theme().textColorPrimary}
              titleStyle={{ fontWeight: constants.fontWeightMedium, fontSize: constants.fontSizeBig }}
            />}
          >
            <img src={item.content} alt="" />
          </CardMedia>}
          {item.content_type === 1 && <CardTitle
            title={item.title}
            titleColor={constants.theme().textColorPrimary}
            titleStyle={{ fontWeight: constants.fontWeightHeavy, fontSize: constants.fontSizeBig }}
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          />}
          {item.content_type === 1 &&
          <CardText color={constants.theme().textColorSecondary} style={{ fontSize: constants.fontSizeMedium, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {item.content}
          </CardText>}
          <CardActions
            style={{
              padding: '0 8px',
              display: 'flex',
              flexDirection: 'row',
              borderTop: `1px solid ${constants.grey50}`,
            }}
          >
            <ActionModule>
              <IconButton
                tooltip="Upvote"
                tooltipPosition="top-center"
                onClick={this.upvote}
                // disabled={!this.props.isLoggedIn || item.vflag === 1}
              >
                <IconUp color={item.vflag === 1 ? constants.blueA100 : constants.grey300} hoverColor={constants.blueA100} />
              </IconButton>
              <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{ups - downs}</small>
              <IconButton
                tooltip="Downvote"
                tooltipPosition="top-center"
                onClick={this.downVote}
                // disabled={!this.props.isLoggedIn || item.vflag === -1}
              >
                <IconDown color={item.vflag === -1 ? constants.redA100 : constants.grey300} hoverColor={constants.redA100} />
              </IconButton>
            </ActionModule>
            <ActionModule>
              <FlatButton
                target="_blank"
                label="Share"
                // icon={<IconShare color={constants.grey300} hoverColor={constants.blueA100} style={{}} />}
                style={{
                  marginTop: 6,
                  lineHeight: '32px',
                  height: 34,
                  minWidth: 60,
                }}
                labelStyle={{ fontSize: constants.fontSizeSmall, paddingLeft: 5, paddingRight: 5 }}
              />
            </ActionModule>
          </CardActions>
        </Card>
        {this.props.isLoggedIn && <CreateComment postID={this.props.data.id} commentsNo={this.props.data.c_comments} post={this.props.data} />}
        <ViewPostComments comments={this.props.comments} isLoggedIn={this.props.isLoggedIn} />
      </div>
    );
  }
}

ViewPostFull.propTypes = {
  /* data */
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  comments: PropTypes.array,
  getPostComments: PropTypes.func,
  upVote: PropTypes.func,
  downVote: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
  comments: state.app.comments.data,
});

const mapDispatchToProps = dispatch => ({
  getPostComments: (postID, sortby, xuser_id) => dispatch(getPostComments(postID, sortby, xuser_id)),
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPostFull);

