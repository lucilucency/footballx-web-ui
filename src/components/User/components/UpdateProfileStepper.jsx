/* eslint-disable no-confusing-arrow */
/* eslint-disable no-return-assign */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Amplitude from 'react-amplitude';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton';
import styled, { css } from 'styled-components';
import { followTeam } from '../../../actions';
import constants from '../../constants';
import strings from '../../../lang';
import UpdateProfileNickname from './UpdateProfileNickname';
import UpdateProfileTeam from './UpdateProfileTeamSelector';
import SuggestedCommunities from './SuggestedCommunities';

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  opacity: 0.2;
  z-index: 1000;
  position: fixed;
  text-align: center;
  background-color: #000;
  display: flex;
  justify-content: center;

  > div {
    height: 400px;
    width: 100%;
    max-width: 700px;
    align-self: center;
  }
  
  ${props => props.show ? css`
    display: flex;  
  ` : css`
    display: none;
  `}
`;

const AdBannerDiv = styled.div`
  width: 100vw;
  min-height: 100vh;
  //top: calc(50vh - 200px);
  //left: calc(15vw);
  opacity: 1;
  z-index: 1000;
  position: fixed;
  text-align: center;
  display: flex;
  justify-content: center;
  
  @media only screen and (max-width: 768px) {
    width: 100vw;
    left: 0;
  }

  > div {
    background-color: ${constants.theme().surfaceColorPrimary};
    min-height: 400px;
    max-height: 100vh;
    overflow: auto;
    width: 100%;
    max-width: 700px;
    align-self: center;
  }
  
  ${props => props.show ? css`
    display: flex;  
  ` : css`
    display: none;
  `}
`;

class HorizontalNonLinearStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanner: !props.user.username,
      stepIndex: 0,
      isValidNickname: false,
    };
  }

  componentDidMount() {
    if (this.state.showBanner) {
      Amplitude.logEvent('Open signup');
    }
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
            this.setState({
              stepIndex: stepIndex + 1,
            });
          }
        });

        break;
      case 1:
        if (this.state.selectedTeam) {
          Amplitude.logEvent('Select team');
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
    Amplitude.logEvent('Follow community');
    this.setState({
      showBanner: false,
    });
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
        <Overlay show={this.state.showBanner} />
        <AdBannerDiv show={this.state.showBanner}>
          <div>
            <h3>{strings.paragraph_update_profile_hi}</h3>
            <p>
              {strings.paragraph_update_profile_welcome} <br />
              {strings.paragraph_update_profile_introduce}
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
                  {strings.label_set_nickname}
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  {strings.label_choose_following_team}
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  {strings.label_choose_following_community}
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
                  {/* <h2>Cool!</h2> */}
                  <p>{strings.hint_choose_following_team}</p>
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
                  <h2>{strings.hint_choose_following_community_1}</h2>
                  <p>{strings.hint_choose_following_community_2}</p>
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
        </AdBannerDiv>
      </div>
    );
  }
}

HorizontalNonLinearStepper.propTypes = {
  user: PropTypes.object,
  // clubs: PropTypes.object,
  followTeam: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  // clubs: state.app.metadata.data.clubs,
});

const mapDispatchToProps = dispatch => ({
  followTeam: (userID, teamID) => dispatch(followTeam(userID, teamID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalNonLinearStepper);
