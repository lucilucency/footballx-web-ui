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
import { followTeam } from '../../actions';
import strings from '../../lang';
import { UpdateUserInfo } from '../User/components';

class RegisterMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      isValidStep1: false,
    };

    this.steps = [{
      heading: strings.heading_update_profile,
      key: 'complete_profile',
      content: (<UpdateUserInfo
        setTrigger={(action) => {
          this.triggerSubmitStep1 = action;
          this.forceUpdate();
        }}
        onChange={(err) => {
          if (err.length) {
            this.setState({ isValidStep1: false });
          } else {
            this.setState({ isValidStep1: true });
          }
        }}
        callback={(isValid) => {
          if (isValid) {
            this.setState({ stepIndex: 1 });
          }
        }}
      />),
      route: `/r/${props.communityID}/register/complete_profile`,
      next: (e) => {
        Promise.all([
          this.triggerSubmitStep1(e),
        ]).then(() => {
          /** problem still here, cant get callback data */
          this.setState({
            stepIndex: 1,
          });
        });
      },
    }];
  }

  componentDidMount() {
    Amplitude.logEvent('Enter register group membership');
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleFinish = () => {
    this.props.onClose();
  };

  render() {
    const { stepIndex } = this.state;
    const contentStyle = {
      margin: '0 16px',
    };

    const step = this.steps[stepIndex];

    return (
      <div>
        <Stepper
          activeStep={stepIndex}
          style={{
            flexFlow: 'row wrap',
            justifyContent: 'center',
          }}
        >
          {this.steps.map(el => (
            <Step key={el.key}>
              <StepLabel>
                {el.heading}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={contentStyle}>
          <div>
            {step && step.content}
          </div>
          <div style={{ marginTop: '1em', marginBottom: '1em' }}>
            {stepIndex !== this.steps.length && <RaisedButton
              label="Next"
              disabled={!this.state.isValidStep1}
              primary
              onClick={step && step.next}
            />}
            {stepIndex === this.steps.length && <RaisedButton
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

RegisterMembership.propTypes = {
  communityID: PropTypes.number,
  onClose: PropTypes.func,
  /**/
  // user: PropTypes.object,
};

// const mapStateToProps = state => ({
//   user: state.app.metadata.data.user,
// });

const mapDispatchToProps = dispatch => ({
  followTeam: (userID, teamID) => dispatch(followTeam(userID, teamID)),
});

export default connect(null, mapDispatchToProps)(RegisterMembership);
