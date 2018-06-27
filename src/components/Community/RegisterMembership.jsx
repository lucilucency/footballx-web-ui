import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import { FlatButton } from 'material-ui';
import Amplitude from 'react-amplitude';
import { } from '../../actions';
import strings from '../../lang';
import { UpdateUserInfo } from '../User/components';
import ChooseMembershipPackage from './components/ChooseMembershipPackage';
import ChoosePlace from './components/ChoosePlace';
import SubmitProgress from './components/SubmitProgress';

class RegisterMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      isStepValid: false,
    };

    this.steps = [
      {
        heading: strings.heading_update_profile,
        key: 'complete_profile',
        content: (<UpdateUserInfo
          setTrigger={(action) => {
            this.triggerSubmit = action;
            this.forceUpdate();
          }}
          onError={(err) => {
            if (err.length) {
              this.setState({ isStepValid: false });
            } else {
              this.setState({ isStepValid: true });
            }
          }}
          onSubmit={isValid => this.checkAfterSubmit('complete_profile', isValid)}
        />),
        route: `/r/${props.communityID}/register/complete_profile`,
        next: e => this.triggerSubmit(e),
      },
      {
        heading: strings.heading_choose_package,
        key: 'choose_package',
        content: (
          <ChooseMembershipPackage
            setTrigger={(action) => {
              this.triggerSubmit = action;
              this.forceUpdate();
            }}
            onError={(err) => {
              if (err.length) {
                this.setState({ isStepValid: false });
              } else {
                this.setState({ isStepValid: true });
              }
            }}
            onSubmit={isValid => this.checkAfterSubmit('choose_package', isValid)}
          />
        ),
        route: `/r/${props.communityID}/register/choose_package`,
        next: e => this.triggerSubmit(e),
      },
      {
        heading: strings.heading_choose_place,
        key: 'choose_place',
        content: (
          <ChoosePlace
            setTrigger={(action) => {
              this.triggerSubmit = action;
              this.forceUpdate();
            }}
            onError={(err) => {
              if (err.length) {
                this.setState({ isStepValid: false });
              } else {
                this.setState({ isStepValid: true });
              }
            }}
            onSubmit={isValid => this.checkAfterSubmit('choose_place', isValid)}
          />
        ),
        route: `/r/${props.communityID}/register/choose_package`,
        next: e => this.triggerSubmit(e),
      },
      {
        heading: strings.heading_complete_register_membership,
        key: 'complete',
        content: <SubmitProgress />,
      },
    ].filter(Boolean);
  }

  componentDidMount() {
    Amplitude.logEvent('Enter register group membership');
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(props.registerMembership) !== JSON.stringify(this.props.registerMembership && props.registerMembership.id)) {
      this.setState({
        stepIndex: this.steps.length - 1,
      });
    }
  }

  /* handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }; */

  checkAfterSubmit = (key, isValid) => {
    if (isValid) {
      this.next();
    }
  };

  next = (callback) => {
    this.setState({
      stepIndex: this.state.stepIndex + 1,
      isStepValid: false,
    }, callback);
  };

  handleFinish = () => {
    if (this.props.onClose) this.props.onClose();
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
          {step && (
            <div>
              <div>
                {step.content}
              </div>
              <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                {stepIndex !== this.steps.length - 1 && <RaisedButton
                  label="Next"
                  disabled={!this.state.isStepValid}
                  primary
                  onClick={step.next}
                />}
                {stepIndex === this.steps.length - 1 && (
                  <div>
                    <RaisedButton
                      label="Purchase now!"
                      primary
                      onClick={this.handleFinish}
                      fullWidth
                    />
                    <FlatButton fullWidth label="Later" onClick={this.handleFinish} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

RegisterMembership.propTypes = {
  communityID: PropTypes.number,
  onClose: PropTypes.func,
  /**/
  registerMembership: PropTypes.object,
};

const mapStateToProps = state => ({
  registerMembership: state.app.metadata.data.registerMembership,
});

export default connect(mapStateToProps)(RegisterMembership);
