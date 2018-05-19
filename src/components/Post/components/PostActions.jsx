/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconButton, FlatButton } from 'material-ui';
import { bindAll, renderDialog } from '../../../utils';
import { IconUpvote, IconDownvote } from '../../Icons';
import { upVote, downVote, setPost } from '../../../actions';
import constants from '../../constants';
import ButtonShare from './ButtonShare';
import ViewPostFullFrame from './PostViewFullFrame';

const PostActionStyled = styled.div`
  padding: 0 0;
  display: table;
  border-top: ${`1px solid ${constants.grey50}`};
  font-weight: ${constants.fontWeightHeavy};
  font-size: ${constants.fontSizeSmall};
  
  > * {
    display: table-cell;
    vertical-align: middle;
  }
`;

class ButtonUpvote extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ButtonUpvote.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'popupViewPostFull',
    ], this);
  }

  upvote = () => {
    if (this.props.isLoggedIn) {
      let { c_ups = 0, c_downs = 0, vflag = 0 } = this.props.data;
      if (vflag === 1) {
        vflag = 0;
        c_ups -= 1;
      } else if (vflag === 0) {
        vflag = 1;
        c_ups += 1;
      } else if (vflag === -1) {
        vflag = 1;
        c_ups += 1;
        c_downs -= 1;
      }

      const payload = {
        ...this.props.data,
        vflag,
        c_ups,
        c_downs,
      };

      this.props.upVote(this.props.data.id, {
        payload,
      }, this.props.type);
    }
  };

  downVote = () => {
    if (this.props.isLoggedIn) {
      let { c_ups = 0, c_downs = 0, vflag = 0 } = this.props.data;
      if (vflag === 1) {
        vflag = -1;
        c_ups -= 1;
        c_downs += 1;
      } else if (vflag === 0) {
        vflag = -1;
        c_downs += 1;
      } else if (vflag === -1) {
        vflag = 0;
        c_downs -= 1;
      }

      const payload = {
        ...this.props.data,
        vflag,
        c_ups,
        c_downs,
      };

      this.props.downVote(this.props.data.id, {
        payload,
      }, this.props.type);
    }
  };

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  popupViewPostFull() {
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

  render() {
    const item = this.props.data;
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
      <div>
        <PostActionStyled>
          <IconButton
            tooltip="Upvote"
            tooltipPosition="top-center"
            onClick={this.upvote}
            disabled={!this.props.isLoggedIn}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            style={{
              // width: 40,
              // height: 40,
              // padding: 5,
            }}
          >
            <IconUpvote color={item.vflag === 1 ? constants.blueA100 : constants.theme().buttonMute} hoverColor={constants.blueA100} />
          </IconButton>
          <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>{ups - downs}</span>
          <IconButton
            tooltip="Downvote"
            tooltipPosition="top-center"
            onClick={this.downVote}
            disabled={!this.props.isLoggedIn}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            style={{
              // width: 40,
              // height: 40,
              // padding: 5,
            }}
          >
            <IconDownvote color={item.vflag === -1 ? constants.redA100 : constants.theme().buttonMute} hoverColor={constants.redA100} />
          </IconButton>
          <div>
            {this.props.disableComment ? (
              <div
                style={{
                  // marginTop: 4,
                  // lineHeight: '32px',
                  // height: 34,
                  // minWidth: 60,
                }}
              >
                {item.c_comments ? `${item.c_comments} comments` : 'Comment'}
              </div>
            ) : (
              <FlatButton
                target="_blank"
                label={item.c_comments ? `${item.c_comments} comments` : 'Comment'}
                style={{
                  // marginTop: 6,
                  // lineHeight: '32px',
                  // height: 34,
                  // minWidth: 60,
                }}
                labelStyle={{
                  // fontSize: constants.fontSizeSmall,
                  // paddingLeft: 5,
                  // paddingRight: 5,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
                onClick={this.popupViewPostFull}
              />
            )}
          </div>
          <ButtonShare
            clipboard={`${window.location.host}/p/${item.id}`}
            child={(
              <FlatButton
                target="_blank"
                label="Share"
                style={{
                  // marginTop: 6,
                  // lineHeight: '32px',
                  // height: 34,
                  // minWidth: 60,
                }}
                labelStyle={{
                  // fontSize: constants.fontSizeSmall,
                  // paddingLeft: 5,
                  // paddingRight: 5,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
              />
            )}
          />
        </PostActionStyled>
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </div>
    );
  }
}

ButtonUpvote.propTypes = {
  type: PropTypes.string.isRequired, /* post, comment */
  data: PropTypes.object,
  disableComment: PropTypes.bool,
  isLoggedIn: PropTypes.bool,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  setPost: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params, type) => dispatch(upVote(postID, params, type)),
  downVote: (postID, params, type) => dispatch(downVote(postID, params, type)),
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUpvote);

