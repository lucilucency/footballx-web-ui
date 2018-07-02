import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Prompt, withRouter } from 'react-router-dom';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import { muiThemeable } from 'material-ui/styles';
import RaisedButton from 'material-ui/RaisedButton';
import Amplitude from 'react-amplitude';
import { format } from 'util';
import { messaging } from '../../firebaseMessaging';
import { ajaxPost, ajaxPut, localUpdateMetadata, announce } from '../../actions';
import strings from '../../lang';
import { UpdateUserInfo } from '../User/components';
import ChooseMembershipPackage from './components/ChoosePackage';
import ChoosePlace from './components/ChoosePlace';
import ReviewTransaction from './components/ReviewTransaction';
import { getStyles } from './muitheme';

class RegisterMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst: true,
      stepIndex: 0,
      isStepValid: false,
      toppingUp: false,
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
        heading: strings.heading_purchase,
        key: 'complete',
        content: (
          <ReviewTransaction
            onRequestEditReceiver={() => {
              this.setState({ stepIndex: 2 });
            }}
          />
        ),
      },
    ].filter(Boolean);
  }

  componentDidMount() {
    Amplitude.logEvent('Enter register group membership');

    messaging.onMessage((payload) => {
      const payloadData = payload.data;
      if (payloadData) {
        // let { body_loc_args } = payloadData;
        const { body_loc_key } = payloadData;
        // body_loc_args = JSON.parse(body_loc_args);

        if (body_loc_key === 'XUSER_TOPUP_XCOIN_SUCCESS') {
          this.setState({ toppingUp: false });
          // const topup = body_loc_args[0];
          // const balance = body_loc_args[1];
          // if (balance > this.props.registerMembership.group_membership_pack_data.price) {
          this.submitPayment();
          // }
        }
      }
    });

    if (this.props.registerMembership && this.props.registerMembership.id && this.props.registerMembership.is_complete) {
      this.props.history.push(`/r/${this.props.communityID}`);
    }
  }

  componentWillReceiveProps(props) {
    const { registerMembership } = props;
    if (registerMembership && registerMembership.id) {
      if (!registerMembership.is_complete) {
        if (this.state.stepIndex !== this.steps.length - 1) {
          this.setState({
            stepIndex: this.steps.length - 1,
            isFirst: false,
          });
        }
      } else {
        props.history.push(`/r/${props.communityID}`);
      }
    }
  }

  submitProcess = () => {
    ajaxPost({
      path: `membership/${this.props.groupMembershipID}/process`,
      params: this.props.registerMembership,
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          const { membership_process } = JSON.parse(res.text);
          this.props.updateMetadata({
            registerMembership: {
              ...this.props.registerMembership,
              id: membership_process.id,
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
    const lastIndex = this.steps.length - 1;
    this.setState({
      stepIndex: this.state.stepIndex < lastIndex ? this.state.stepIndex + 1 : lastIndex,
      isStepValid: false,
    }, callback);
  };

  /**
   * 0. Check balance, if userBalance < packagePrice go (2). else (3).
   * 1. Prompt
   * 2  Top-up -> waiting firebase notification
   * 3. Purchase
   * 4. Notify & back to community's home
   * */
  purchase = (e) => {
    e.preventDefault();
    const { price } = this.props.registerMembership.group_membership_pack_data;
    const { xcoin } = this.props.balance;

    if (xcoin >= price) {
      this.submitPayment();
    } else {
      this.topup();
    }
  };

  submitPayment = () => {
    ajaxPut({
      path: `membership/${this.props.groupMembershipID}/process/${this.props.registerMembership.id}/payment`,
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          this.setState({ toppingUp: false });
          const { balance } = JSON.parse(res.text);

          this.props.announceFn({
            message: format(strings.notification_XUSER_DEBITED_XCOIN_SUCCESS, this.props.registerMembership.group_membership_pack_data.price, balance.xcoin || 0),
            action: 'Check it out',
            autoHideDuration: 300000,
          });
          this.props.updateMetadata({
            balance: {
              ...this.props.balance,
              ...balance,
            },
            registerMembership: {
              ...this.props.registerMembership,
              is_complete: true,
            },
          });
        } catch (parseErr) {
          console.error(parseErr);
        }
      }
    });
  };

  topup = () => {
    ajaxPost({
      path: 'payment/bank',
      params: {
        amount: this.props.registerMembership.group_membership_pack_data.price,
      },
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          const { trans } = JSON.parse(res.text);
          this.setState({
            toppingUp: true,
          });
          window.open(
            trans.pay_url,
            '_blank', // <- This is what makes it open in a new window.
          );
          setTimeout(() => this.submitPayment(), 10000);
        } catch (parseErr) {
          console.error(parseErr);
        }
      }
    });
  };

  handleFinish = (e) => {
    e.preventDefault();
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      this.props.history.push(`/r/${this.props.communityID}`);
    }
  };

  render() {
    const { muiTheme } = this.props;
    const { stepIndex } = this.state;
    const step = this.steps[stepIndex];
    const style = getStyles(muiTheme);

    return (
      <div style={{ minHeight: 800 }}>
        <Stepper
          activeStep={stepIndex}
          // linear={this.props.registerMembership && this.props.registerMembership.id}
          linear={false}
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
              <div style={{ marginTop: '1em', marginBottom: '1em', textAlign: 'center' }}>
                {stepIndex !== this.steps.length - 1 && <RaisedButton
                  label="Next"
                  disabled={!this.state.isStepValid}
                  primary
                  style={{ width: 200 }}
                  onClick={step.next}
                />}
                {stepIndex === this.steps.length - 1 && (
                  <div>
                    <RaisedButton
                      label="PURCHASE NOW!"
                      disabled={!this.props.registerMembership
                      || !this.props.registerMembership.group_membership_pack_data
                      || !this.props.registerMembership.group_membership_pack_data.price}
                      primary
                      style={{ ...style.noBorderBtn.style, width: 200 }}
                      onClick={this.purchase}
                    />
                    {this.state.isFirst && <RaisedButton
                      label="LATER"
                      onClick={this.handleFinish}
                      style={{ ...style.noBorderBtn.style, width: 200, marginLeft: 20 }}
                      backgroundColor={muiTheme.paper.backgroundColor}
                      labelStyle={style.noBorderBtn.labelStyle}
                    />}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Prompt message="Quá trình nạp tiền đang tiến hành. Bạn vẫn tiếp tục muốn thoát?" when={this.state.toppingUp} />
      </div>
    );
  }
}

RegisterMembership.propTypes = {
  communityID: PropTypes.number,
  groupMembershipID: PropTypes.number,
  onClose: PropTypes.func,
  /**/
  muiTheme: PropTypes.object,
  balance: PropTypes.object,
  registerMembership: PropTypes.object,
  updateMetadata: PropTypes.func,
  announceFn: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  groupMembershipID: state.app.community.data.groupMemberships && state.app.community.data.groupMemberships.id,
  registerMembership: state.app.metadata.data.registerMembership,
  balance: state.app.metadata.data.balance,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
  announceFn: props => dispatch(announce(props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  muiThemeable(),
)(RegisterMembership);
