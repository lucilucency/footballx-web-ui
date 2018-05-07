import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import IconUp from 'material-ui/svg-icons/action/thumb-up';
import IconDown from 'material-ui/svg-icons/action/thumb-down';
import { upVote, downVote } from '../../../actions';
import strings from '../../../lang';
import { toDateTimeString, bindAll, renderDialog, ActiveLink, MutedLink } from '../../../utils';
import constants from '../../constants';
import ViewPostFull from './ViewPostFull';

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
    this.setState({
      dialogConstruct: {
        // title: strings.heading_edit_team,
        view: <ViewPostFull
          data={this.props.data}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  upvote = () => {
    const payload = {
      ...this.props.data,
      c_ups: (this.props.data.c_ups || 0) + 1,
    };

    this.props.upVote(this.props.data.id, {
      payload,
    });
  };

  downVote = () => {
    const payload = {
      ...this.props.data,
      c_ups: Math.max((this.props.data.c_ups || 0) - 1, 0),
    };

    this.props.downVote(this.props.data.id, {
      payload,
    });
  };

  render() {
    const item = this.props.data;
    const userLink = <MutedLink to={`/u/${item.xuser_id}`}>{item.xuser_nickname}</MutedLink>;
    const postLink = <MutedLink to={`/post/${item.id}`}>{toDateTimeString(item.created_at)}</MutedLink>;
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
        >
          <img src={item.content} alt="" />
        </CardMedia>}
        {(item.content_type === 1 || item.content_type === 3) && <CardTitle
          title={item.title}
          titleColor={constants.theme().textColorPrimary}
          titleStyle={{ fontWeight: constants.fontWeightMedium, fontSize: constants.fontSizeBig }}
          style={{ paddingTop: 0, paddingBottom: 0 }}
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
          <div style={{ display: 'flex', flexDirection: 'row', marginRight: 5 }}>
            <IconButton
              tooltip="Upvote"
              tooltipPosition="bottom-right"
              onClick={this.upvote}
            >
              <IconUp color={constants.grey300} hoverColor={constants.blueA100} />
            </IconButton>
            <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_ups || 0}</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton
              tooltip="Downvote"
              tooltipPosition="bottom-right"
              onClick={this.downVote}
            >
              <IconDown color={constants.grey300} hoverColor={constants.blueA100} />
            </IconButton>
            <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_downs || 0}</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', marginRight: 5 }}>
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
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </Card>
    );
  }
}

ViewPostCompact.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  upVote: PropTypes.func,
  downVote: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params) => dispatch(upVote(postID, params)),
  downVote: (postID, params) => dispatch(downVote(postID, params)),
});


export default connect(null, mapDispatchToProps)(ViewPostCompact);
