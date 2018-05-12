import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RaisedButton, Subheader } from 'material-ui';
import strings from '../../../lang';
import { bindAll, renderDialog, SmallPaper, Container, RightTray } from '../../../utils';
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
        view: (
          <Container browser={this.props.browser}>
            <SmallPaper>
              <CreateEditPost
                callback={this.handleCloseDialog}
                popup
              />
            </SmallPaper>
            <RightTray>
              <div data="page-welcome">
                <SmallPaper>
                  <Subheader>Popular</Subheader>
                  <p>
                    The best posts on Footballx for you, pulled from the most active communities on Reddit.
                    Check here to see the most shared, upvoted, and commented content on the internet.
                  </p>
                </SmallPaper>
              </div>
              <div data="ads">
                <SmallPaper>
                  <Subheader>Ads</Subheader>
                </SmallPaper>
              </div>
            </RightTray>
          </Container>
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

const mapStateToProps = state => ({
  browser: state.browser,
});

CreateEditPostButton.propTypes = {
  browser: PropTypes.object,
};

export default connect(mapStateToProps, null)(CreateEditPostButton);
