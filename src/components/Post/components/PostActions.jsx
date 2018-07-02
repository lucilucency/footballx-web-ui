import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconButton, FlatButton } from 'material-ui';
import Amplitude from 'react-amplitude';

import { bindAll, renderDialog } from '../../../utils';
import { IconUpvote, IconDownvote, IconComment, IconShare } from '../../Icons';
import { upVote, downVote, setPost } from '../../../actions';
import ui from '../../../theme';
import ButtonShare from '../../../utils/ButtonShare';
import ViewPostFullFrame from './PostViewFullFrame';
import strings from '../.././../lang';

const PostActionStyled = styled.div`
  padding: 0 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  font-weight: ${ui.fontWeightMedium};
  font-size: ${ui.fontSizeSmall};
  color: ${ui.neutralColor};
  
  .up-down {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  
  span {
    color: ${ui.neutralColor};
  }
`;

class PostActions extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      ...PostActions.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'popupViewPostFull',
    ], this);
  }

  upvote = () => {
    if (this.props.isLoggedIn) {
      Amplitude.logEvent('Upvote post');
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
    } else {
      localStorage.setItem('previousPage', `/p/${this.props.data.id}`);
      window.location.href = '/sign_in';
    }
  };

  downVote = () => {
    if (this.props.isLoggedIn) {
      Amplitude.logEvent('Downvote post');
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
    } else {
      localStorage.setItem('previousPage', `/p/${this.props.data.id}`);
      // this.props.history.push('/sign_in');
      window.location.href = '/sign_in';
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

  routerToViewPostFull = () => {
    const { data } = this.props;
    this.props.history.push({
      pathname: `/p/${data.id}`,
      state: {
        data,
      },
    });
  };

  render() {
    const item = this.props.data;
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
      <div>
        <PostActionStyled>
          <div className="up-down">
            <IconButton
              tooltip="Upvote"
              tooltipPosition="top-center"
              onClick={this.upvote}
              // disabled={!this.props.isLoggedIn}
              iconStyle={{
                width: 20,
                height: 20,
              }}
              style={{
                width: 32,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <IconUpvote color={item.vflag === 1 ? ui.positive1Color : ui.neutralColor} hoverColor={ui.positive1Color} />
            </IconButton>
            <span>{ups - downs}</span>
            <IconButton
              tooltip="Downvote"
              tooltipPosition="top-center"
              onClick={this.downVote}
              // disabled={!this.props.isLoggedIn}
              iconStyle={{
                width: 20,
                height: 20,
              }}
              style={{
                width: 32,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <IconDownvote color={item.vflag === -1 ? ui.negativeColor : ui.neutralColor} hoverColor={ui.negativeColor} />
            </IconButton>
          </div>
          <div>
            {this.props.disableComment ? (
              <div style={{ display: 'block' }}>
                <IconComment style={{ margin: '-5px 5px auto auto', display: 'inline-block', verticalAlign: 'middle' }} color={ui.neutralColor} />
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{item.c_comments || 0}</span>
              </div>
            ) : (
              <FlatButton
                target="_blank"
                label={item.c_comments || strings.label_comment}
                icon={<IconComment style={{ marginTop: -5 }} color={ui.neutralColor} />}
                labelPosition="after"
                labelStyle={{
                  paddingLeft: 5,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
                onClick={this.props.browser.greaterThan.small ? this.popupViewPostFull : this.routerToViewPostFull}
              />
            )}
          </div>
          <ButtonShare
            clipboard={`${window.location.host}/p/${item.id}`}
            child={(
              <FlatButton
                label={strings.label_share_post}
                icon={<IconShare color={ui.neutralColor} />}
                labelPosition="after"
                labelStyle={{
                  paddingLeft: 0,
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

PostActions.propTypes = {
  type: PropTypes.string.isRequired, /* post, comment */
  data: PropTypes.object,
  disableComment: PropTypes.bool,
  isLoggedIn: PropTypes.bool,

  /**/
  browser: PropTypes.object,
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  setPost: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params, type) => dispatch(upVote(postID, params, type)),
  downVote: (postID, params, type) => dispatch(downVote(postID, params, type)),
  setPost: payload => dispatch(setPost(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostActions));

