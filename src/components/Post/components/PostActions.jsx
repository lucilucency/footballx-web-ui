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
import constants from '../../constants';
import ButtonShare from './ButtonShare';
import ViewPostFullFrame from './PostViewFullFrame';
import strings from '../.././../lang';

const PostActionStyled = styled.div`
  padding: 0 0;
  display: table;
  border-top: ${`1px solid ${constants.grey50}`};
  font-weight: ${constants.fontWeightMedium};
  font-size: ${constants.fontSizeSmall};
  color: ${constants.theme().neutralColor};
  
  > * {
    display: table-cell;
    vertical-align: middle;
  }
  
  span {
    color: ${constants.theme().neutralColor};
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
            // disabled={!this.props.isLoggedIn}
            iconStyle={{
              width: 20,
              height: 20,
            }}
          >
            <IconUpvote color={item.vflag === 1 ? constants.theme().positiveColor : constants.theme().neutralColor} hoverColor={constants.positiveColor} />
          </IconButton>
          <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>{ups - downs}</span>
          <IconButton
            tooltip="Downvote"
            tooltipPosition="top-center"
            onClick={this.downVote}
            // disabled={!this.props.isLoggedIn}
            iconStyle={{
              width: 20,
              height: 20,
            }}
          >
            <IconDownvote color={item.vflag === -1 ? constants.theme().negativeColor : constants.theme().neutralColor} hoverColor={constants.theme().negativeColor} />
          </IconButton>
          <div>
            {this.props.disableComment ? (
              <div>
                {item.c_comments ? `${item.c_comments} comments` : 'Comment'}
              </div>
            ) : (
              <FlatButton
                target="_blank"
                label={item.c_comments ? `${item.c_comments} comments` : 'Comment'}
                icon={<IconComment style={{ marginTop: -5 }} color={constants.theme().neutralColor} />}
                labelPosition="after"
                labelStyle={{
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
                label={strings.label_share_post}
                icon={<IconShare color={constants.theme().neutralColor} />}
                labelPosition="after"
                labelStyle={{
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
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  setPost: PropTypes.func,
  // history: PropTypes.object,
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

