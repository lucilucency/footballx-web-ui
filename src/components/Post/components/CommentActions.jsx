import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconButton, FlatButton } from 'material-ui';
import Amplitude from 'react-amplitude';
import strings from '../.././../lang';
import { IconUpvote, IconDownvote, IconComment, IconShare } from '../../Icons';
import { upVote, downVote } from '../../../actions';
import constants from '../../constants';
import ButtonShare from './ButtonShare';
import CreateEditComment from './CreateEditComment';

const Styled = styled.div`
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

class CommentActions extends React.Component {
  static initialState = {
    showCommentBox: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...CommentActions.initialState,
    };
  }

  upvote = () => {
    if (this.props.isLoggedIn) {
      Amplitude.logEvent('Upvote comment');
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
      Amplitude.logEvent('Downvote comment');
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

  toggleCommentBox = () => {
    this.setState({
      showCommentBox: !this.state.showCommentBox,
    });
  };

  render() {
    const item = this.props.data;
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
      <div>
        <Styled>
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
            <IconUpvote color={item.vflag === 1 ? constants.blueA100 : constants.theme().buttonMute} hoverColor={constants.blueA100} />
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
            <IconDownvote color={item.vflag === -1 ? constants.redA100 : constants.theme().buttonMute} hoverColor={constants.redA100} />
          </IconButton>
          {this.props.disableComment ? (
            <div>
              {item.c_comments ? `${item.c_comments} comments` : 'Comment'}
            </div>
          ) : (
            <FlatButton
              target="_blank"
              label={item.c_comments ? `${item.c_comments} comments` : 'Comment'}
              icon={<IconComment style={{ marginTop: -5 }} />}
              labelPosition="after"
              labelStyle={{
                fontWeight: 'inherit',
                fontSize: 'inherit',
              }}
              onClick={this.toggleCommentBox}
            />
          )}
          <ButtonShare
            clipboard={`${window.location.host}/p/${item.id}`}
            child={(
              <FlatButton
                label={strings.label_share_post}
                icon={<IconShare />}
                labelPosition="after"
                labelStyle={{
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
              />
            )}
          />
        </Styled>
        {this.state.showCommentBox && <CreateEditComment post={this.props.data} />}
      </div>
    );
  }
}

CommentActions.propTypes = {
  type: PropTypes.string.isRequired, /* post, comment */
  data: PropTypes.object,
  disableComment: PropTypes.bool,
  isLoggedIn: PropTypes.bool,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  // history: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params, type) => dispatch(upVote(postID, params, type)),
  downVote: (postID, params, type) => dispatch(downVote(postID, params, type)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentActions));

