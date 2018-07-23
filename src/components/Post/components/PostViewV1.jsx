import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui-next/styles';
import classnames from 'classnames';
import { Card, CardActions, CardHeader, CardContent, IconButton, Collapse, Avatar } from 'material-ui-next';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Amplitude from 'react-amplitude';
import ui from '../../../theme';
import { getCommentsInPost, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, getCookie, MutedLink, ActiveLink, linkify } from '../../../utils';
import ViewPostComments from './CommentGrid';
import CreateComment from './CreateEditComment';
import PostActions from './PostActions';
import { LinkCoverStyled, LinkPreview, ContentText, Image, ImageWrapper } from './Styled';

const markdown = require('markdown-it')({
  html: false,
  linkify: false,
});

const styles = theme => ({
  card: {
    boxShadow: 'none',
    fontFamily: ui.fontFamilySecondary,
  },
  cardContent: {
    paddingTop: 0,
  },
  cardText: {
    fontWeight: 'normal',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: ui.fontFamilySecondary,
    fontSize: ui.fontSizeSmall,
    lineHeight: ui.lineHeightSmall,
    textAlign: 'justify',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: ui.fontSizeNormal,
    lineHeight: ui.lineHeightNormal,
    WebkitMarginAfter: '8px',
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class PostViewV1 extends React.Component {
  state = { expanded: true };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    this.props.getPostComments(this.props.postID || this.props.data.id, 'hot', getCookie('user_id'));
    Amplitude.logEvent('View post detail');
  }

  renderLink = (contentSring = {}) => {
    try {
      const content = contentSring ? JSON.parse(contentSring) : {};
      return (
        <div>
          <LinkPreview hasImage={content.image}>
            <a href={content.url} target="_blank" rel="noopener noreferrer">{content.url}</a>
            {content.image && (
              <img src={content.image} alt="" />
            )}
          </LinkPreview>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  render() {
    const { classes, isCompact } = this.props;

    const item = this.props.data;
    const isText = item.content_type === 1;
    const isImage = item.content_type === 2;
    const isLink = item.content_type === 3;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_username || item.xuser_nickname}</MutedLink>;
    const postLink = <MutedLink to={`/p/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={<Avatar aria-label="Recipe" className={classes.avatar} src={item.community_icon} />}
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={<ActiveLink to={`/r/${item.community_id}`}>{item.community_name}</ActiveLink>}
            subheader={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
          />
          <CardContent className={classes.cardContent}>
            <div className={classes.cardTitle}>
              <ContentText dangerouslySetInnerHTML={{ __html: linkify(item.title) }} />
            </div>
            {isText && (
              <div className={classes.cardText}>
                <ContentText dangerouslySetInnerHTML={{ __html: linkify(markdown.renderInline(item.content || '')) }} />
              </div>
            )}
            {isImage &&
            <ImageWrapper>
              <Image
                src={item.content}
                alt=""
              />
            </ImageWrapper>}
            {isLink && this.renderLink(item.content)}
          </CardContent>

          <CardActions className={classes.actions} disableActionSpacing>
            <PostActions
              type="post"
              data={this.props.data}
              disableComment
              isLoggedIn={this.props.isLoggedIn}
              isCompact={isCompact}
            />
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show comments"
              tooltip="Show comments"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          {this.props.isLoggedIn && <CreateComment target={this.props.data} />}
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <ViewPostComments isLoggedIn={this.props.isLoggedIn} />
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

PostViewV1.propTypes = {
  postID: PropTypes.number,
  data: PropTypes.object,
  isLoggedIn: PropTypes.bool,

  /**/
  isCompact: PropTypes.bool,
  getPostComments: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isCompact: state.browser.lessThan.small,
  comments: state.app.comments.data,
  data: state.app.post.data,
});

const mapDispatchToProps = dispatch => ({
  getPostComments: (postID, sortby, xuser_id) => dispatch(getCommentsInPost(postID, sortby, xuser_id)),
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostViewV1));

