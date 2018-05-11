import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, Subheader } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled, { css } from 'styled-components';
import IconButton from 'material-ui/IconButton';
import IconUp from 'material-ui/svg-icons/action/thumb-up';
import IconDown from 'material-ui/svg-icons/action/thumb-down';
import { upVote, downVote, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, bindAll, renderDialog, ActiveLink, MutedLink, SmallPaper, Container, RightTray } from '../../../utils';
import constants from '../../constants';
import ViewPostFull from './ViewPostFull';

const HEIGHT = 400;

const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

const ActionModule = styled.div`
  display: flex; 
  flex-direction: row;
  margin-right: 5px;
`;

const ImageWrapper = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
`;
const Image = styled.img`
  vertical-align: middle;
  height: ${HEIGHT}px;
  width: auto;
  min-width: 0;
`;
const Background = styled.div`
  ${props => props.src && css`
    background-image: url(${props.src});
    background-size: cover;
    display: block;
    filter: blur(3px);
    height: ${HEIGHT}px;
  `}
`;

class ViewPostCompact extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewPostCompact.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'popupViewPostFull',
    ], this);
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  popupViewPostFull() {
    this.props.setPost(this.props.data);
    this.setState({
      dialogConstruct: {
        // title: strings.heading_edit_team,
        view: (
          <Container browser={this.props.browser}>
            <SmallPaper>
              <ViewPostFull
                postID={this.props.data.id}
                isLoggedIn={this.props.isLoggedIn}
              />
            </SmallPaper>
            <RightTray>
              {this.props.isLoggedIn && (
                <div data="page-welcome">
                  <SmallPaper>
                    <Subheader>Popular</Subheader>
                    <p>
                      The best posts on Footballx for you, pulled from the most active communities on Reddit.
                      Check here to see the most shared, upvoted, and commented content on the internet.
                    </p>
                  </SmallPaper>
                </div>
              )}
              <div data="ads">
                <SmallPaper>
                  <Subheader>Ads</Subheader>
                </SmallPaper>
              </div>
              {this.props.isLoggedIn && (
                <div data="suggested-communities">
                  <SmallPaper>
                    <Subheader>Suggested communities</Subheader>
                  </SmallPaper>
                </div>
              )}
            </RightTray>
          </Container>
        ),
        repositionOnUpdate: false,
        autoDetectWindowHeight: false,
        modal: false,
        open: true,
        fullScreen: true,
        // contentStyle: { width: '100%', maxWidth: 'none' },
      },
    }, () => {
      this.handleOpenDialog();
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
    const postLink = (
      <MutedLink
        to={{
          pathname: `/p/${item.id}`,
          state: {
            data: item,
          },
        }}
      >
        {toDateTimeString(item.created_at)}
      </MutedLink>
    );
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
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
            style={{
              overflow: 'hidden',
              textAlign: 'center',
            }}
            onClick={this.popupViewPostFull}
          >
            <Background src={item.content} />
            <ImageWrapper>
              <Image
                src={item.content}
                alt=""
              />
            </ImageWrapper>
          </CardMedia>
        }
        {(item.content_type === 1 || item.content_type === 3) && <CardTitle
          title={item.title}
          titleColor={constants.theme().textColorPrimary}
          titleStyle={{ fontWeight: constants.fontWeightMedium, fontSize: constants.fontSizeBig }}
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        />}
        {(item.content_type === 1 || item.content_type === 3) &&
        <CardText style={{ fontSize: constants.fontSizeMedium, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {item.content_type === 3 ? <a href={`${item.content}`} target="_blank">{item.content}</a> : item.content}
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
              disabled={!this.props.isLoggedIn}
            >
              <IconUp color={item.vflag === 1 ? constants.blueA100 : constants.grey300} hoverColor={constants.blueA100} />
            </IconButton>
            <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{ups - downs}</small>
            <IconButton
              tooltip="Downvote"
              tooltipPosition="top-center"
              onClick={this.downVote}
              disabled={!this.props.isLoggedIn}
            >
              <IconDown color={item.vflag === -1 ? constants.redA100 : constants.grey300} hoverColor={constants.redA100} />
            </IconButton>
          </ActionModule>
          <ActionModule>
            <FlatButton
              target="_blank"
              label={item.c_comments ? `${item.c_comments} comments` : 'Comment'}
              // icon={<IconShare color={constants.grey300} hoverColor={constants.blueA100} style={{}} />}
              style={{
                marginTop: 6,
                lineHeight: '32px',
                height: 34,
                minWidth: 60,
              }}
              labelStyle={{ fontSize: constants.fontSizeSmall, paddingLeft: 5, paddingRight: 5 }}
              onClick={this.popupViewPostFull}
            />
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
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </Card>
    );
  }
}

ViewPostCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  setPost: PropTypes.func,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
  setPost: payload => dispatch(setPost(payload)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ViewPostCompact);
