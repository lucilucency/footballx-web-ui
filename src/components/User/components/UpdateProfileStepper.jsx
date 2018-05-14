/* eslint-disable no-confusing-arrow */
import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import styled, { css } from 'styled-components';
import constants from '../../constants';
import { updateMetadata } from '../../../actions';
import UpdateProfileNickname from './UpdateProfileNickname';

const AdBannerDiv = styled.div`
  
  
  width: 100vw;
  height: 100vh;
  opacity: 0.98;
  z-index: 1000;
  position: fixed;
  text-align: center;
  background-color: ${constants.theme().surfaceColorPrimary};
  display: flex;
  justify-content: center;

  > div {
    height: 500px;
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
  state = {
    showBanner: true,
    stepIndex: 0,
    isAllowNickname: false,
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex < 2) {
      this.setState({ stepIndex: stepIndex + 1 });
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleFinish = () => {
    this.setState({
      showBanner: false,
    });
  };

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (<UpdateProfileNickname
          onChange={isAllow => this.setState({ isAllowNickname: isAllow })}
          callback={() => this.setState({ stepIndex: 1 })}
        />);
      case 1:
        return (
          <div>
            <h2>Cool!</h2>
            <p>What is your favorite team?</p>
          </div>
        );
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'You\'re a long way from home!';
    }
  };

  isAvailableToGo = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.state.isAllowNickname;
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
      <AdBannerDiv show={this.state.showBanner}>
        <div>
          <h3>Hi, stranger</h3>
          <p>
            WELCOME TO OUR HOOD <br />
            At Footballx, you’ll help build something that encourages millions around the world to think more, do more, learn more, feel more– and maybe even laugh more.
          </p>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 0 })}>
                Set your nickname
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                Choose your team
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                Follow communities
              </StepButton>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {this.getStepContent(stepIndex)}
            <div style={{ marginTop: 12 }}>
              <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
                style={{ marginRight: 12 }}
              />
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
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(updateMetadata(payload)),
});

HorizontalNonLinearStepper.propTypes = {
  // user: PropTypes.object,
  // updateMetadata: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(HorizontalNonLinearStepper);
