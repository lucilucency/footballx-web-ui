import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import strings from '../../../lang';
import { bindAll, renderDialog } from '../../../utils';
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
    this.setState({
      dialogConstruct: {
        view: (
          <CreateEditPostFrame />
        ),
        modal: true,
        fullScreen: true,
      },
    }, () => {
      this.handleOpenDialog();
    });
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
  // browser: PropTypes.object,
  // user: PropTypes.object,
};

export default connect()(CreateEditPostButton);
