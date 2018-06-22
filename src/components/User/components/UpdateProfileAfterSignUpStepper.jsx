import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import Amplitude from 'react-amplitude';
import { followTeam } from '../../../actions';
import strings from '../../../lang';
import UpdateProfileNickname from './UpdateNickname';
import UpdateProfileTeam from './UpdateFollowingTeams';
import SuggestedCommunities from './SuggestedCommunities';

class HorizontalNonLinearStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // showBanner: true,
      stepIndex: 0,
      isValidNickname: false,
    };
  }

  componentDidMount() {
    // console.log('Open sign-up');
    Amplitude.logEvent('Sign-up');
    this.props.onStart(this.props.user);
  }

  handleNext = () => {
    const { stepIndex } = this.state;

    switch (stepIndex) {
      case 0:
        Promise.all([
          this.triggerSubmitNickname(),
        ]).then(() => {
          if (this.props.user.username) {
            Amplitude.logEvent('Set username');
            this.props.onStart();
            this.setState({
              stepIndex: stepIndex + 1,
            });
          }
        });

        break;
      case 1:
        if (this.state.selectedTeam) {
          Amplitude.logEvent('Select favourite team');
          this.props.followTeam(this.props.user.id, this.state.selectedTeam.id);
        }

        this.setState({ stepIndex: stepIndex + 1 });
        break;
      default:
        break;
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleFinish = () => {
    Amplitude.logEvent('Complete sign up');
    this.props.onClose();
  };

  isAvailableToGo = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.state.isValidNickname;
      case 1:
        return true;
      default:
        return false;
    }
  };

  render() {
    const { stepIndex } = this.state;
    const contentStyle = {
      margin: '0 16px',
    };

    return (
      <div>
        {/* <h3>{strings.paragraph_complete_sign_up_hi}</h3> */}
        <p>
          {/* {strings.paragraph_complete_sign_up_welcome} <br /> */}
          {strings.paragraph_complete_sign_up_introduce}
        </p>
        <Stepper
          activeStep={stepIndex}
          style={{
            flexFlow: 'row wrap',
            justifyContent: 'center',
          }}
        >
          <Step>
            <StepLabel>
              {strings.heading_update_nickname}
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              {strings.heading_update_following_team}
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              {strings.heading_update_following_communities}
            </StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 && (
            <UpdateProfileNickname
              setTrigger={(action) => {
                this.triggerSubmitNickname = action;
              }}
              onChange={(isValid) => {
                this.setState({ isValidNickname: isValid });
              }}
              callback={(isValid) => {
                if (isValid) {
                  this.setState({ stepIndex: 1 });
                }
              }}
            />
          )}
          {stepIndex === 1 && (
            <div>
              {/* <p>{strings.paragraph_update_following_team}</p> */}
              <UpdateProfileTeam
                onSelect={(resp) => {
                  this.setState({
                    selectedTeam: resp.value,
                  });
                }}
              />
            </div>
          )}
          {stepIndex === 2 && (
            <div>
              {/* <p>{strings.paragraph_update_following_communities}</p> */}
              <SuggestedCommunities />
            </div>
          )}
          <div style={{ marginTop: '1em', marginBottom: '1em' }}>
            {/* <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              onClick={this.handlePrev}
              style={{ marginRight: 12 }}
            /> */}
            {stepIndex !== 2 && <RaisedButton
              label="Next"
              disabled={!this.isAvailableToGo(stepIndex)}
              primary
              onClick={this.handleNext}
            />}
            {stepIndex === 2 && <RaisedButton
              label="Start your journey!"
              primary
              onClick={this.handleFinish}
            />}
          </div>
        </div>
      </div>
    );
  }
}

HorizontalNonLinearStepper.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func,
  onStart: PropTypes.func,
  /**/
  // clubs: PropTypes.object,
  followTeam: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  followTeam: (userID, teamID) => dispatch(followTeam(userID, teamID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalNonLinearStepper);
