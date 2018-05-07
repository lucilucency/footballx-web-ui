/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, FlatButton, IconButton } from 'material-ui';
import IconUp from 'material-ui/svg-icons/action/thumb-up';
import IconDown from 'material-ui/svg-icons/action/thumb-down';
import { getPostComments } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString } from '../../../utils';
import constants from '../../constants';
import ViewPostComments from './ViewPostComments';
import CreateComment from './CreateEditComment';

const ActiveLink = styled(Link)`
  :hover {
    text-decoration: underline;
  }
`;

const MutedLink = styled(Link)`
  color: ${constants.colorMutedLight};
  
  :hover {
    text-decoration: underline;
  }
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
    Promise.all([this.props.getPostComments(this.props.data.id, 'hot', this.props.user.id)]).then(() => {
      setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
    });
  }

  render() {
    const item = this.props.data;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_nickname}</MutedLink>;
    const postLink = <MutedLink to={`/post/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;

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
            style={{ paddingTop: 0, paddingBottom: 0 }}
          />}
          {item.content_type === 1 &&
          <CardText color={constants.theme().textColorSecondary} style={{ fontSize: constants.fontSizeMedium }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: 5 }}>
              <IconButton
                tooltip="Upvote"
                tooltipPosition="bottom-right"
              >
                <IconUp color={constants.grey300} hoverColor={constants.blueA100} />
              </IconButton>
              <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_ups || 0}</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <IconButton
                tooltip="Downvote"
                tooltipPosition="bottom-right"
              >
                <IconDown color={constants.grey300} hoverColor={constants.blueA100} />
              </IconButton>
              <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_downs || 0}</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: 5 }}>
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
            </div>
          </CardActions>
        </Card>
        <CreateComment postID={this.props.data.id} />
        <ViewPostComments comments={this.props.comments} />
      </div>
    );
  }
}

ViewPostFull.propTypes = {
  /* data */
  data: PropTypes.object.isRequired,
  comments: PropTypes.array,

  /**/
  user: PropTypes.object,
  getPostComments: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
  comments: state.app.comments.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  getPostComments: (postID, sortby, xuser_id) => dispatch(getPostComments(postID, sortby, xuser_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPostFull);

