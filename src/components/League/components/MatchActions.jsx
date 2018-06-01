import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  // IconButton,
  FlatButton,
} from 'material-ui';
import IconLive from 'material-ui/svg-icons/notification/live-tv';
import { bindAll, renderDialog } from '../../../utils';
// import { IconUpvote, IconDownvote } from '../../Icons';
import { upVote, downVote, setPost } from '../../../actions';
import constants from '../../constants';
import ButtonShare from '../../../utils/ButtonShare';
import strings from '../../../lang';

const MatchActionStyled = styled.div`
  padding: 0 0;
  display: table;
  border-top: ${`1px solid ${constants.grey50}`};
  font-weight: ${constants.fontWeightHeavy};
  font-size: ${constants.fontSizeSmall};
  font-family: ${constants.theme().fontFamily};
  
  > * {
    display: table-cell;
    vertical-align: middle;
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

  render() {
    const item = this.props.data;
    // const ups = item.c_ups || 0;
    // const downs = item.c_downs || 0;

    return (
      <div>
        <MatchActionStyled>
          {/* <IconButton
            tooltip="Upvote"
            tooltipPosition="top-center"
            onClick={this.upvote}
            disabled={!this.props.isLoggedIn}
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
            disabled={!this.props.isLoggedIn}
            iconStyle={{
              width: 20,
              height: 20,
            }}
          >
            <IconDownvote color={item.vflag === -1 ? constants.redA100 : constants.theme().buttonMute} hoverColor={constants.redA100} />
          </IconButton> */}
          <div>
            {this.props.disableComment ? (
              <div>
                {this.props.count ? `${this.props.count} comments` : 'Comment'}
              </div>
            ) : (
              <FlatButton
                target="_blank"
                label={this.props.count ? `${this.props.count} comments` : 'Comment'}
                onClick={() => this.props.history.push(`/m/${item.id}`)}
              />
            )}
          </div>
          <ButtonShare
            clipboard={`${window.location.host}/m/${item.id}`}
            child={(
              <FlatButton
                target="_blank"
                label={strings.label_share_match}
                labelStyle={{
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
              />
            )}
          />
          <FlatButton
            target="_blank"
            label={strings.label_live_stream}
            icon={<IconLive style={{ width: 18, height: 18 }} />}
            labelStyle={{
              fontWeight: 'inherit',
              fontSize: 'inherit',
            }}
            onClick={this.props.onClickOpenLive}
          />
        </MatchActionStyled>
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </div>
    );
  }
}

PostActions.propTypes = {
  type: PropTypes.string.isRequired, /* post, comment */
  count: PropTypes.number, /* comment numbers */
  data: PropTypes.object,
  disableComment: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  onClickOpenLive: PropTypes.func,

  /**/
  upVote: PropTypes.func,
  downVote: PropTypes.func,
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

