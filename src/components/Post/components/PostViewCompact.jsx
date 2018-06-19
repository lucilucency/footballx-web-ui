import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardHeader, CardMedia, CardText } from 'material-ui';
import { upVote, downVote, setPost } from '../../../actions';
import strings from '../../../lang';
import { ActiveLink, MutedLink, bindAll, renderDialog, styles, toDateTimeString } from '../../../utils';
// import ui from '../../../theme';
import PostActions from './PostActions';
import { LinkCoverStyled, ImageCompact, ImageWrapper, TextWrapper, LinkPreview } from './Styled';
import ViewPostFullFrame from './PostViewFullFrame';

const CONTENT_MAX_LEN = 1000;

const markdown = require('markdown-it')({
  html: true,
  linkify: true,
});

const wrapTextReadMore = (text, callback) => {
  if (!text) { return ''; }
  if (text.length < CONTENT_MAX_LEN) return <TextWrapper dangerouslySetInnerHTML={{ __html: markdown.renderInline(text) }} />;

  return (
    <div>
      <TextWrapper dangerouslySetInnerHTML={{ __html: markdown.renderInline(text.slice(0, CONTENT_MAX_LEN)) }} />
      <a href="" onClick={callback}>{strings.label_read_more}</a>
    </div>
  );
};

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

class ViewPostCompact extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
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

  renderLink = (contentSring) => {
    const content = isJsonString(contentSring) ? JSON.parse(contentSring) : {
      url: contentSring,
    };

    return (
      <CardText style={styles.cardText.style}>
        <LinkPreview hasImage={content.image}>
          <a href={content.url} target="_blank" rel="noopener noreferrer">{content.url}</a>
          {content.image && (
            <a href={content.url} target="_blank" rel="noopener noreferrer"><img src={content.image} alt="" /></a>
          )}
        </LinkPreview>
      </CardText>
    );
  };

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  popupViewPostFull(e) {
    e.preventDefault();
    this.props.setPost(this.props.data);
    this.setState({
      dialogConstruct: {
        view: (
          <ViewPostFullFrame
            isLoggedIn={this.props.isLoggedIn}
          />
        ),
        repositionOnUpdate: false,
        autoDetectWindowHeight: false,
        modal: false,
        open: true,
        fullScreen: true,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  routerToViewPostFull = () => {
    const { data } = this.props;
    this.props.history.push({
      pathname: `/p/${data.id}`,
      state: {
        data,
      },
    });
  };

  render() {
    const item = this.props.data;
    const isText = item.content_type === 1;
    const isImage = item.content_type === 2;
    const isLink = item.content_type === 3;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_username || item.xuser_nickname}</MutedLink>;
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
    const followingCommunityIDs = this.props.followingCommunities.map(el => el.id);
    const isFollowing = communityID => followingCommunityIDs.indexOf(communityID) !== -1;
    const communityLink = (
      <ActiveLink
        to={{
          pathname: `/r/${item.community_id}`,
          state: {
            data: {
              id: item.community_id,
              icon: item.community_icon,
              link: item.community_link,
              name: item.community_name,
              isFollowing: isFollowing(item.community_id),
            },
          },
        }}
      >
        {item.community_name}
      </ActiveLink>
    );

    return (
      <Card style={styles.card.style}>
        <CardHeader
          title={<div style={{ ...styles.cardHeader.title, display: 'inline' }}>{communityLink} &nbsp;<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled></div>}
          subtitle={<span style={styles.cardTitle.titleStyle}>{item.title}</span>}
          avatar={item.community_icon}
          style={styles.cardHeader.style}
        />
        {/* <CardTitle
          title={item.title}
          titleColor={ui.textColorPrimary}
          titleStyle={styles.cardTitle.titleStyle}
          style={styles.cardTitle.style}
        /> */}
        {isImage &&
        <CardMedia
          style={styles.cardMedia.style}
          onClick={this.props.browser.greaterThan.small ? this.popupViewPostFull : this.routerToViewPostFull}
        >
          <ImageWrapper>
            <ImageCompact
              src={item.content}
              alt=""
            />
          </ImageWrapper>
        </CardMedia>
        }
        {isLink && this.renderLink(item.content)}
        {isText && (
          <CardText
            style={styles.cardText.style}
          >
            {wrapTextReadMore(item.content, this.popupViewPostFull)}
          </CardText>
        )}
        <CardActions style={styles.cardActions.style}>
          <PostActions
            type="post"
            data={this.props.data}
            disableComment={false}
            isLoggedIn={this.props.isLoggedIn}
          />
        </CardActions>
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </Card>
    );
  }
}

ViewPostCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  browser: PropTypes.object,
  setPost: PropTypes.func,
  followingCommunities: PropTypes.array,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
  followingCommunities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
  setPost: payload => dispatch(setPost(payload)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewPostCompact));
