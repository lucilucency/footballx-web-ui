import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, FlatButton } from 'material-ui';
import IconCake from 'material-ui/svg-icons/social/cake';
import IconEmail from 'material-ui/svg-icons/communication/email';
// import IconLocation from 'material-ui/svg-icons/communication/location-on';
import IconPhone from 'material-ui/svg-icons/hardware/phone-android';
import styled from 'styled-components';
import { RightTray, SmallPaper, toDateString, renderDialog } from '../../../../utils/index';
import strings from '../../../../lang';
import AboutXFooter from '../../../About/Footer';
import Avatar from './Avatar';
import UpdateUserInfoForm from '../UpdateUserInfoForm';

const RightTrayStyled = styled(RightTray)`
  .info {
    li {
      display: block;
    }
    li svg {
      display: inline-block;
      vertical-align: baseline;
    }
    li span {
      display: inline-block;
      vertical-align: super;
    }    
  }
`;

class UserProfile extends React.Component {
  state = {
    openDialog: false,
    dialog: {},
  };

  componentDidMount() {

  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  popupEditProfile = () => {
    this.setState({
      dialog: {
        view: (
          <UpdateUserInfoForm
            callback={(isValid) => {
              if (isValid) {
                this.handleCloseDialog();
              }
            }}
          />
        ),
        repositionOnUpdate: true,
        autoDetectWindowHeight: true,
        // fullScreen: true,
      },
    }, () => {
      this.handleOpenDialog();
    });
  };

  render() {
    const { props } = this;
    const {
      userMetadata,
      // loggedInUserID, isCompact,
    } = props;
    const { user } = userMetadata;
    return (
      <RightTrayStyled>
        <SmallPaper>
          <Avatar data={userMetadata.user} />
          <Divider />
          <div className="info">
            {user && (
              <div>
                <li><IconCake /> <span>{toDateString(user.birthday)}</span></li>
                <li><IconEmail /> <span>{user.email}</span></li>
                <li><IconPhone /> <span>{user.phone}</span></li>
              </div>
            )}
          </div>
          <FlatButton
            label={strings.label_edit_profile}
            onClick={this.popupEditProfile}
            fullWidth
          />
        </SmallPaper>
        <div>
          <AboutXFooter />
        </div>
        {renderDialog(this.state.dialog, this.state.openDialog, this.handleCloseDialog)}
      </RightTrayStyled>
    );
  }
}

UserProfile.propTypes = {
  // isCompact: PropTypes.bool,
  // loggedInUserID: PropTypes.number,
  // userMetadata: PropTypes.object,
};

export default connect()(UserProfile);
