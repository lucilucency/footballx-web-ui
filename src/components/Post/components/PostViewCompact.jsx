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
import { LinkCoverStyled, ImageCompact, ImageWrapper, LinkPreview } from './Styled';


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
    const content = contentSring ? JSON.parse(contentSring) : {};

    return (
      <CardText>
        <LinkPreview hasImage={content.image}>
          <a href={content.url} target="_blank">{content.url}</a>
          {content.image && <img src={content.image} alt="" style={{ maxWidth: 200 }} />}
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
        <CardTitle
          title={item.title}
          titleColor={constants.theme().textColorPrimary}
          titleStyle={{
            fontWeight: constants.fontWeightHeavy,
            fontSize: constants.fontSizeBig,
            lineHeight: 1.44,
          }}
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            wordBreak: 'break-word',
          }}
        />
        {isImage &&
        <CardMedia
          style={{
            overflow: 'hidden',
            textAlign: 'center',
          }}
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
          <CardText
            style={{
              fontSize: constants.fontSizeMedium,
              wordBreak: 'break-word',
            }}
          >
            {item.content}
          </CardText>
        )}
        <CardActions
          style={{
            padding: '0 0',
          }}
        >
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
