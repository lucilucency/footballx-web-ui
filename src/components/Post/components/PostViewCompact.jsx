import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardHeader, CardMedia, CardText } from 'material-ui';
import { upVote, downVote, setPost } from '../../../actions';
import strings from '../../../lang';
import { ActiveLink, MutedLink, bindAll, renderDialog, styles, toDateTimeString } from '../../../utils';
import PostActions from './PostActions';
import { LinkCoverStyled, ImageCompact, ImageWrapper, ContentText, LinkPreview } from './Styled';
import ViewPostFullFrame from './PostViewFullFrame';

const CONTENT_MAX_LEN = 800;
const CONTENT_MAX_LEN_COMPACT = 400;

const markdown = require('markdown-it')({
  html: true,
  linkify: true,
});

const wrapTextReadMore = (text, callback, isCompact) => {
  if (!text) { return ''; }
  if (text.length < CONTENT_MAX_LEN) return <ContentText dangerouslySetInnerHTML={{ __html: markdown.renderInline(text) }} />;

  return (
    <div>
      <ContentText dangerouslySetInnerHTML={{ __html: markdown.renderInline(text.slice(0, isCompact ? CONTENT_MAX_LEN_COMPACT : CONTENT_MAX_LEN)) }} />
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
      <CardText style={this.props.isCompact ? styles.cardText.styleCompact : styles.cardText.style}>
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

  routerToViewPostFull = (e) => {
    e.preventDefault();
    const { data } = this.props;
    this.props.history.push({
      pathname: `/p/${data.id}`,
      state: {
        data,
      },
    });
  };

  render() {
    const { isCompact } = this.props;

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
              isFollowing: this.props.isFollowing,
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
          title={<div style={{ display: 'inline' }}>{communityLink} {isCompact && <LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}</div>}
          subtitle={!isCompact && <LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
          avatar={item.community_icon}
          style={!isCompact ? styles.cardHeader.style : styles.cardHeader.styleCompact}
        />
        <div style={isCompact ? styles.cardTitle.titleStyleCompact : styles.cardTitle.titleStyle}>
          <ContentText dangerouslySetInnerHTML={{ __html: markdown.renderInline(item.title) }} />
        </div>
        {isImage &&
        <CardMedia
          style={isCompact ? styles.cardMedia.styleCompact : styles.cardMedia.style}
          onClick={isCompact ? this.routerToViewPostFull : this.popupViewPostFull}
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
            style={isCompact ? styles.cardText.styleCompact : styles.cardText.style}
          >
            {wrapTextReadMore(item.content, !isCompact ? this.popupViewPostFull : this.routerToViewPostFull, isCompact)}
          </CardText>
        )}
        <CardActions style={isCompact ? styles.cardActions.styleCompact : styles.cardActions.style}>
          <PostActions
            type="post"
            data={this.props.data}
            disableComment={false}
            isLoggedIn={this.props.isLoggedIn}
            isCompact={this.props.isCompact}
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
  isCompact: PropTypes.bool,
  setPost: PropTypes.func,
  isFollowing: PropTypes.bool,
  history: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
  setPost: payload => dispatch(setPost(payload)),
});

export default withRouter(connect(null, mapDispatchToProps)(ViewPostCompact));
