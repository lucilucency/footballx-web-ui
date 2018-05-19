/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import styled from 'styled-components';
import { upVote, downVote, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, ActiveLink, MutedLink } from '../../../utils';
import constants from '../../constants';
import PostActions from './PostActions';

const ImageWrapper = styled.div`
  text-align: center;
  width: 100%;
`;
const Image = styled.img`
  vertical-align: middle;
  max-width: 100%;
  max-height: 512px;
  margin: 0 auto;
  display: block;
  position: relative;
`;
const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
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
  }

  render() {
    const item = this.props.data;
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
            // paddingBottom: 0,
            // whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
        {item.content_type === 2 &&
        <CardMedia
          style={{
            overflow: 'hidden',
            textAlign: 'center',
          }}
          onClick={this.popupViewPostFull}
        >
          <ImageWrapper>
            <Image
              src={item.content}
              alt=""
            />
          </ImageWrapper>
        </CardMedia>
        }
        {(item.content_type === 1 || item.content_type === 3) && (
          <CardText
            style={{
              fontSize: constants.fontSizeMedium,
              // whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {item.content_type === 3 ? <a href={`${item.content}`} target="_blank">{item.content}</a> : item.content}
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
