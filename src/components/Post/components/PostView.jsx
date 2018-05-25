import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import { getPostComments, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, getCookie, MutedLink, ActiveLink } from '../../../utils';
import constants from '../../constants';
import ViewPostComments from './PostComments';
import CreateComment from './CreateEditPostComment';
import ButtonUpvote from './PostActions';
import { LinkCoverStyled, Image, ImageWrapper, LinkPreview, TextWrapper, styles } from './Styled';

const markdown = require('markdown-it')({
  html: true,
  linkify: true,
});

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
    this.props.getPostComments(this.props.postID || this.props.data.id, 'hot', getCookie('user_id'));
  }

  renderLink = (contentSring) => {
    const content = contentSring ? JSON.parse(contentSring) : {};

    return (
      <CardText>
        <LinkPreview hasImage={content.image}>
          <a href={content.url} target="_blank">{content.url}</a>
          {content.image && (
            <img src={content.image} alt="" />
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
    const postLink = <MutedLink to={`/p/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;

    return (
      <div>
        <Card
          style={{
            boxShadow: 'none',
            textAlign: 'left',
          }}
        >
          <CardHeader
            title={<ActiveLink to={`/r/${item.community_link}`}>{item.community_name}</ActiveLink>}
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
              <Image
                src={item.content}
                alt=""
              />
            </ImageWrapper>
          </CardMedia>}
          {isLink && this.renderLink(item.content)}
          {isText &&
          <CardText
            color={constants.theme().textColorSecondary}
            style={styles.cardText.style}
          >
            <TextWrapper dangerouslySetInnerHTML={{ __html: markdown.renderInline(item.content || '') }} />
          </CardText>}
          <CardActions>
            <ButtonUpvote
              type="post"
              data={this.props.data}
              disableComment
              isLoggedIn={this.props.isLoggedIn}
            />
          </CardActions>
        </Card>
        {this.props.isLoggedIn && <CreateComment post={this.props.data} />}
        <ViewPostComments comments={this.props.comments} isLoggedIn={this.props.isLoggedIn} />
      </div>
    );
  }
}

ViewPostFull.propTypes = {
  /* data */
  postID: PropTypes.number,
  data: PropTypes.object,
  isLoggedIn: PropTypes.bool,

  /**/
  comments: PropTypes.array,
  getPostComments: PropTypes.func,
};

const mapStateToProps = state => ({
  comments: state.app.comments.data,
  data: state.app.post.data,
});

const mapDispatchToProps = dispatch => ({
  getPostComments: (postID, sortby, xuser_id) => dispatch(getPostComments(postID, sortby, xuser_id)),
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPostFull);

