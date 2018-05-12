import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, FlatButton } from 'material-ui';
import { getPostComments, setPost } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, getCookie, MutedLink, ActiveLink } from '../../../utils';
import constants from '../../constants';
import ViewPostComments from './ViewPostComments';
import CreateComment from './CreateEditComment';
import ButtonUpvote from './ButtonUpvote';

const HEIGHT = 400;

const ActionModule = styled.div`
  display: flex; 
  flex-direction: row;
  margin-right: 5px;
`;

const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

const ImageWrapper = styled.div`
  text-align: center;
  width: 100%;
`;
const Image = styled.img`
  vertical-align: middle;
  height: ${HEIGHT}px;
  width: auto;
  min-width: 0;
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
    Promise.all([this.props.getPostComments(this.props.postID, 'hot', getCookie('user_id'))])
      .then(() => {
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
      });
  }

  render() {
    const item = this.props.data;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_nickname}</MutedLink>;
    const postLink = <MutedLink to={`/p/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;

    return (
      <div>
        <Card
          key={item.id}
          style={{
            boxShadow: 'none',
          }}
        >
          <CardHeader
            title={<ActiveLink to={`/r/${item.community_link}`}>{item.community_name}</ActiveLink>}
            subtitle={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
            avatar={item.community_icon}
            style={{ padding: '1em 1em 0.5em 1em' }}
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
              padding: '0 0',
              display: 'flex',
              flexDirection: 'row',
              borderTop: `1px solid ${constants.grey50}`,
              fontWeight: constants.fontWeightHeavy,
            }}
          >
            <ButtonUpvote
              type="post"
              isLoggedIn={this.props.isLoggedIn}
              data={this.props.data}
            />
            <ActionModule>
              <FlatButton
                target="_blank"
                label={item.c_comments ? `${item.c_comments} comments` : 'Comment'}
                // icon={<IconShare color={constants.theme().buttonMute} hoverColor={constants.blueA100} style={{}} />}
                style={{
                  marginTop: 2,
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
            <ActionModule>
              <FlatButton
                target="_blank"
                label="Share"
                // icon={<IconShare color={constants.grey300} hoverColor={constants.blueA100} style={{}} />}
                style={{
                  marginTop: 2,
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
  browser: state.browser,
  comments: state.app.comments.data,
  data: state.app.post.data,
});

const mapDispatchToProps = dispatch => ({
  getPostComments: (postID, sortby, xuser_id) => dispatch(getPostComments(postID, sortby, xuser_id)),
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPostFull);

