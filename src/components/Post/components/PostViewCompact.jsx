/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import { upVote, downVote, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, ActiveLink, MutedLink } from '../../../utils';
import constants from '../../constants';
import PostActions from './PostActions';
import { LinkCoverStyled, ImageCompact, ImageWrapper, TextWrapper, LinkPreview, styles } from './Styled';

const markdown = require('markdown-it')({
  html: true,
  linkify: true,
});

function IsJsonString(str) {
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
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewPostCompact.initialState,
    };
  }

  renderLink = (contentSring) => {
    const content = IsJsonString(contentSring) ? JSON.parse(contentSring) : {
      url: contentSring,
    };

    return (
      <CardText>
        <LinkPreview hasImage={content.image}>
          <a href={content.url} target="_blank">{content.url}</a>
          {content.image && (
            <a href={content.url} target="_blank"><img src={content.image} alt="" /></a>
          )}
        </LinkPreview>
      </CardText>
    );
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
            },
          },
        }}
      >
        {item.community_name}
      </ActiveLink>
    );

    return (
      <Card>
        <CardHeader
          title={communityLink}
          subtitle={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
          avatar={item.community_icon}
          style={styles.cardHeader.style}
        />
        <CardTitle
          title={item.title}
          titleColor={constants.theme().textColorPrimary}
          titleStyle={styles.cardTitle.titleStyle}
          style={styles.cardTitle.style}
        />
        {isImage &&
        <CardMedia
          style={styles.cardMedia.style}
          onClick={this.popupViewPostFull}
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
          <CardText style={styles.cardText.style}>
            <TextWrapper dangerouslySetInnerHTML={{ __html: markdown.renderInline(item.content || '') }} />
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
      </Card>
    );
  }
}

ViewPostCompact.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
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
