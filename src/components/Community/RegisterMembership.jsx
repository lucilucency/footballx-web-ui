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
import { ajaxPost, localUpdateMetadata } from '../../actions';
import strings from '../../lang';
import { UpdateUserInfo } from '../User/components';
import ChooseMembershipPackage from './components/ChooseMembershipPackage';
import ChoosePlace from './components/ChoosePlace';
import ReviewTransaction from './components/ReviewTransaction';

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
            onSubmit={isValid => this.checkAfterSubmit('choose_place', isValid, this.submitProcess())}
          />
        ),
        route: `/r/${props.communityID}/register/choose_package`,
        next: e => this.triggerSubmit(e),
      },
      {
        heading: strings.heading_complete_register_membership,
        key: 'complete',
        content: <ReviewTransaction />,
      },
    ].filter(Boolean);
  }

  componentDidMount() {
    Amplitude.logEvent('Enter register group membership');
  }

  componentWillReceiveProps(props) {
    const { registerMembership } = props;
    if (registerMembership && registerMembership.id && this.state.stepIndex !== this.steps.length - 1) {
      this.setState({
        stepIndex: this.steps.length - 1,
      });
    }
  }

  submitProcess = () => {
    ajaxPost({
      path: `membership/${this.props.gmData.id}/process`,
      params: this.props.registerMembership,
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          const { membership_process } = JSON.parse(res.text);
          this.props.updateMetadata({
            registerMembership: {
              ...this.props.registerMembership,
              ...membership_process,
            },
          });
        } catch (parseErr) {
          console.error(parseErr);
        }
      }
    });
  };

  purchase = (e) => {
    e.preventDefault();
    ajaxPost({
      path: 'payment/bank',
      params: {
        amount: this.props.registerMembership.group_membership_pack_data.price,
      },
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          const { trans } = JSON.parse(res.text);
          window.open(
            trans.pay_url,
            '_blank', // <- This is what makes it open in a new window.
          );
          this.props.updateMetadata({
            registerMembership: {
              ...this.props.registerMembership,
              ...trans,
            },
          });
        } catch (parseErr) {
          console.error(parseErr);
        }
      }
    });
  };

  /* handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }; */

  checkAfterSubmit = (key, isValid, callback) => {
    if (isValid) {
      this.next(callback);
    }
  };

  next = (callback) => {
    this.setState({
      stepIndex: this.state.stepIndex + 1,
      isStepValid: false,
    }, callback);
  };

  handleFinish = (e) => {
    e.preventDefault();
    if (this.props.onClose) this.props.onClose();
  };

  render() {
    const { stepIndex } = this.state;
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
        <div>
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
                      disabled={!this.props.registerMembership
                      || !this.props.registerMembership.group_membership_pack_data
                      || !this.props.registerMembership.group_membership_pack_data.price}
                      primary
                      onClick={this.purchase}
                      style={{ margin: '0 16px' }}
                    />
                    <RaisedButton secondary style={{ margin: '0 16px' }} label="Later" onClick={this.handleFinish} />
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
  gmData: PropTypes.object,
  onClose: PropTypes.func,
  /**/
  registerMembership: PropTypes.object,
  updateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  gmData: state.app.community.data.groupMemberships,
  registerMembership: state.app.metadata.data.registerMembership,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMembership);
