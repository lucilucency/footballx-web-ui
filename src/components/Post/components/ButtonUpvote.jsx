import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconButton } from 'material-ui';
import { IconUpvote, IconDownvote } from '../../Icons';
import { upVote, downVote, setPost } from '../../../actions';
import constants from '../../constants';

const ActionModule = styled.div`
  display: flex; 
  flex-direction: row;
  margin-right: 5px;
`;

class ButtonUpvote extends React.Component {
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

  render() {
    const item = this.props.data;
    const ups = item.c_ups || 0;
    const downs = item.c_downs || 0;

    return (
      <ActionModule>
        <IconButton
          tooltip="Upvote"
          tooltipPosition="top-center"
          onClick={this.upvote}
          disabled={!this.props.isLoggedIn}
          iconStyle={{
            width: 32,
            height: 32,
          }}
          style={{
            width: 40,
            height: 40,
            padding: 5,
          }}
        >
          <IconUpvote color={item.vflag === 1 ? constants.blueA100 : constants.theme().buttonMute} hoverColor={constants.blueA100} />
        </IconButton>
        <span style={{ verticalAlign: 'middle', lineHeight: '40px' }}>{ups - downs}</span>
        <IconButton
          tooltip="Downvote"
          tooltipPosition="top-center"
          onClick={this.downVote}
          disabled={!this.props.isLoggedIn}
          iconStyle={{
            width: 32,
            height: 32,
          }}
          style={{
            width: 40,
            height: 40,
            padding: 5,
          }}
        >
          <IconDownvote color={item.vflag === -1 ? constants.redA100 : constants.theme().buttonMute} hoverColor={constants.redA100} />
        </IconButton>
      </ActionModule>
    );
  }
}

ButtonUpvote.propTypes = {
  data: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  type: PropTypes.string.isRequired,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
  data: state.app.post.data,
});

const mapDispatchToProps = dispatch => ({
  upVote: (postID, params, type) => dispatch(upVote(postID, params, type)),
  downVote: (postID, params, type) => dispatch(downVote(postID, params, type)),
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUpvote);

