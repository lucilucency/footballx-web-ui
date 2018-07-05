import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import strings from '../../../lang';
import { bindAll, renderDialog, getCookie } from '../../../utils';
import CreateEditPostFrame from './CreateEditPostFrame';

class CreateEditPostButton extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...CreateEditPostButton.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'popupCreatePost',
    ], this);
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  popupCreatePost() {
    if (getCookie('user_id')) {
      this.setState({
        dialogConstruct: {
          view: (
            <CreateEditPostFrame
              callback={this.handleCloseDialog}
            />
          ),
          modal: true,
          fullScreen: true,
        },
      }, () => {
        this.handleOpenDialog();
      });
    } else {
      // localStorage.setItem('previousPage', '/submit');
      // window.location.href = '/sign_in';
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: '/submit',
          },
        },
      });
    }
  }

  render() {
    return (
      <div>
        <RaisedButton
          target="_blank"
          label={strings.button_create_post}
          onClick={this.popupCreatePost}
          fullWidth
          primary
        />
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </div>
    );
  }
}

CreateEditPostButton.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
};

export default withRouter(CreateEditPostButton);
