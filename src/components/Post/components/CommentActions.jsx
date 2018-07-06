import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconButton, FlatButton } from 'material-ui';
import Amplitude from 'react-amplitude';
import { IconUpvote, IconDownvote, IconComment } from '../../Icons';
import { upVote, downVote } from '../../../actions';
import ui from '../../../theme';
// import ButtonShare from '../../../utils/ButtonShare';
import CreateEditComment from './CreateEditComment';

const Styled = styled.div`
  padding: 0 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  font-weight: ${ui.fontWeightMedium};
  font-size: ${ui.fontSizeSmall};
  
  :before {
    content : "";
    position: absolute;
    left    : 30px;
    bottom  : 0;
    height  : 1px;
    width   : calc(100% - 60px);
    border-bottom:1px solid ${ui.borderColorVariant1};
    
    @media only screen and (max-width: 480px) {
      left: 10px;
      width   : calc(100% - 20px);
    }
  }
  
  .up-down {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  
  span {
    color: ${ui.neutralColor};
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
      // localStorage.setItem('previousPage', `/p/${this.props.data.id}`);
      // window.location.href = '/sign_in';
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/p/${this.props.data.id}`,
          },
        },
      });
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
      // localStorage.setItem('previousPage', `/p/${this.props.data.id}`);
      // window.location.href = '/sign_in';
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/p/${this.props.data.id}`,
          },
        },
      });
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
            >
              <IconUpvote color={item.vflag === 1 ? ui.positive1Color : ui.neutralColor} hoverColor={ui.positive1Color} />
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
              <IconDownvote color={item.vflag === -1 ? ui.negativeColor : ui.neutralColor} hoverColor={ui.negativeColor} />
            </IconButton>
          </div>
          <div>
            {this.props.disableComment ? (
              <div style={{ display: 'block' }}>
                <IconComment style={{ margin: '-5px 5px auto auto', display: 'inline-block', verticalAlign: 'middle' }} color={ui.neutralColor} />
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{item.c_comments ? `${item.c_comments} comments` : 'Comment'}</span>
              </div>
            ) : (
              <FlatButton
                target="_blank"
                label={item.c_comments || 0}
                icon={<IconComment style={{ marginTop: -5 }} color={ui.neutralColor} />}
                labelPosition="after"
                labelStyle={{
                  paddingLeft: 5,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
                onClick={this.toggleCommentBox}
              />
            )}
          </div>
          {/* //TODO share comment */}
          {/* <ButtonShare
            clipboard={`${window.location.host}/p/${item.id}`}
            child={(
              <FlatButton
                icon={<IconShare color={ui.neutralColor} />}
                labelPosition="after"
                labelStyle={{
                  paddingLeft: 0,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
              />
            )}
          /> */}
        </Styled>
        {this.state.showCommentBox && <CreateEditComment target={this.props.data} callback={this.toggleCommentBox} />}
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
  history: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params, type) => dispatch(upVote(postID, params, type)),
  downVote: (postID, params, type) => dispatch(downVote(postID, params, type)),
});

export default withRouter(connect(mapDispatchToProps)(CommentActions));

