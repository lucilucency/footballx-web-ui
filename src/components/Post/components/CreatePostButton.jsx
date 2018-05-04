import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import strings from '../../../lang';
import { bindAll, renderDialog } from '../../../utils';
import CreateEditPost from './CreateEditPost';

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
        // title: strings.heading_edit_team,
        view: <CreateEditPost
          callback={this.handleCloseDialog}
        />,
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
          label={strings.label_create_post}
          onClick={this.popupCreatePost}
          fullWidth
          primary
        />
        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </div>
    );
  }
}

CreateEditPostButton.propTypes = {};

export default connect()(CreateEditPostButton);
