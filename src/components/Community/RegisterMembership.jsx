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
import { messaging } from '../../firebaseMessaging';
import { IconProgress, IconSuccess } from '../Icons';
import { ajaxPost, ajaxPut, localUpdateMetadata, announce } from '../../actions';
import { format, renderDialog } from '../../utils';
import strings from '../../lang';
import { UpdateUserInfo } from '../User/components';
import ChooseMembershipPackage from './components/ChoosePackage';
import GroupLandingPage1 from './components/GroupLandingPage1';
import GroupLandingPage2 from './components/GroupLandingPage2';
import ChoosePlace from './components/ChooseReceiver';
import ReviewTransaction from './components/ReviewTransaction';
import { getStyles } from './muitheme';

class RegisterMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst: true,
      stepIndex: 0,
      isStepValid: false,
      toppingUp: 0,
      openDialog: false,
      closeDialogCallback: null,
      dialog: {},
    };

    this.handleOpenDialog = (cb) => { this.setState({ openDialog: true }, cb); };
    this.handleCloseDialog = (cb) => {
      this.setState({ openDialog: false }, cb);
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
            onRequestEditProfile={() => {
              this.setState({ stepIndex: 0 });
            }}
          />
        ),
      },
    ].filter(Boolean);
  }

  componentDidMount() {
    Amplitude.logEvent('Enter register group membership');

    if (messaging) {
      messaging.onMessage((payload) => {
        const payloadData = payload.data;
        if (payloadData) {
          // let { body_loc_args } = payloadData;
          const { body_loc_key } = payloadData;
          // body_loc_args = JSON.parse(body_loc_args);

          if (body_loc_key === 'XUSER_TOPUP_XCOIN_SUCCESS') {
            // const topup = body_loc_args[0];
            // const balance = body_loc_args[1];
            // if (balance > this.props.registerMembership.group_membership_pack_data.price) {
            this.submitPayment();
            // }
          }
        }
      });
    }

    if (this.props.registerMembership && this.props.registerMembership.id && this.props.registerMembership.is_complete) {
      this.props.history.push(`/r/${this.props.communityID}`);
    }
  }

  componentWillReceiveProps(props) {
    const { registerMembership, balance } = props;
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

      if (registerMembership.group_membership_pack_data && registerMembership.xuser_address_data) {
        if (!this.state.isFirst) {
          const { price } = registerMembership.group_membership_pack_data;
          const { xcoin } = balance;

          if (xcoin >= price) {
            this.submitPayment();
          }
        }
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
      if (this.props.registerMembership
        && this.props.registerMembership.group_membership_pack_id
        // && this.props.registerMembership.group_membership_pack_data
        // && this.props.registerMembership.group_membership_pack_data.price
        && this.props.registerMembership.xuser_address_id
        // && this.props.registerMembership.xuser_address_data
      ) {
        this.end(callback);
      } else {
        this.next(callback);
      }
    }
  };

  next = (callback) => {
    const lastIndex = this.steps.length - 1;
    this.setState({
      stepIndex: this.state.stepIndex < lastIndex ? this.state.stepIndex + 1 : lastIndex,
      isStepValid: false,
    }, callback);
  };

  end = (callback) => {
    const lastIndex = this.steps.length - 1;
    this.setState({
      stepIndex: lastIndex,
    }, callback);
  };

  /**
   * 0. Check balance, if userBalance < packagePrice go (2). else (3).
   * 1. Prompt
   * 2  Top-up -> waiting firebase notification
   * 3. Purchase
   * 4. Notify & back to community's home
   * */
  confirmPurchase = (e) => {
    if (e) e.preventDefault();
    const { price } = this.props.registerMembership.group_membership_pack_data;
    const { xcoin } = this.props.balance;

    if (xcoin >= price) {
      this.submitPayment();
    } else {
      this.topup(price);
    }
  };

  submitPayment = () => {
    ajaxPut({
      path: `membership/${this.props.groupMembershipID}/process/${this.props.registerMembership.id}/payment`,
    }, (err, res) => {
      if (res.ok && res.text) {
        try {
          const { balance } = JSON.parse(res.text);

          /* clear polling */
          clearInterval(this.polling);

          this.setState({
            dialog: {
              view: (
                <GroupLandingPage2
                  // group_memberships={this.props.group_memberships.find(el => el.group_membership_id === this.props.registerMembership.group_membership_id)}
                  muiTheme={this.props.muiTheme}
                  user={this.props.user}
                />
              ),
              contentStyle: {
                width: '100%',
                maxWidth: 'none',
              },
              autoScrollBodyContent: true,
            },
            closeDialogCallback: () => {
              this.props.updateMetadata({
                registerMembership: {
                  ...this.props.registerMembership,
                  is_complete: true,
                },
              });
            },
            toppingUp: 2,
          }, this.handleOpenDialog());

          this.props.announceFn({
            message: format(strings.notification_XUSER_DEBITED_XCOIN_SUCCESS, this.props.registerMembership.group_membership_pack_data.price, balance.xcoin || 0),
            autoHideDuration: 300000,
          });

          this.props.updateMetadata({
            balance: {
              ...this.props.balance,
              ...balance,
            },
          });
        } catch (parseErr) {
          console.error(parseErr);
        }
      }
    });
  };

  topup = (price) => {
    ajaxPost({
      path: 'payment/bank',
      params: {
        amount: price,
      },
    }).then((body) => {
      const { trans } = body;
      this.setState({
        toppingUp: 4,
        topupURL: trans.pay_url,
      });

      // const win = trans.pay_url;
      // window.open(win, '1366002941508', 'width=800,height=600,left=5,top=3');

      this.polling = setInterval(() => {
        this.submitPayment();
      }, 10000);
    });
  };

  handleFinish = (e) => {
    e.preventDefault();
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      // this.props.history.push(`/r/${this.props.communityID}`);
      this.setState({
        dialog: {
          view: (
            <GroupLandingPage1
              registerMembership={this.props.registerMembership}
              muiTheme={this.props.muiTheme}
              user={this.props.user}
            />
          ),
          fullScreen: true,
          contentStyle: {
            width: '100%',
            maxWidth: 'none',
          },
          autoScrollBodyContent: true,
        },
        closeDialogCallback: () => {
          this.props.history.push(`/r/${this.props.communityID}`);
        },
      }, this.handleOpenDialog());
    }
  };

  render() {
    const { muiTheme, isCompact } = this.props;
    const { stepIndex } = this.state;
    const step = this.steps[stepIndex];
    const style = getStyles(muiTheme);

    const getIcon = () => {
      switch (this.state.toppingUp) {
        case 1:
          return <IconProgress size={24} />;
        case 2:
          return <IconSuccess size={24} />;
        default:
          return null;
      }
    };

    return (
      <div style={{ minHeight: isCompact ? 600 : 1200 }}>
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
                {!isCompact && el.heading}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {false && this.state.topupURL && (
          <div style={{ width: '100%', backgroundColor: 'black', textAlign: 'center' }}>
            <iframe
              title="topup"
              src={this.state.topupURL}
              width="600"
              height="600"
              frameBorder="0"
              scrolling="yes"
              allowFullScreen
            />
          </div>
        )}
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
                    {this.state.toppingUp === 0 && (
                      <RaisedButton
                        label="CONFIRM"
                        labelPosition="before"
                        disabled={!this.props.registerMembership
                        || !this.props.registerMembership.group_membership_pack_data
                        || !this.props.registerMembership.group_membership_pack_data.price}
                        primary
                        style={{ ...style.noBorderBtn.style, width: 200, margin: 10 }}
                        onClick={this.confirmPurchase}
                      />
                    )}
                    {(this.state.toppingUp === 4 || this.state.toppingUp === 1) && (
                      <RaisedButton
                        label="PURCHASE NOW!"
                        icon={getIcon()}
                        labelPosition="before"
                        disabled={!this.props.registerMembership
                        || !this.props.registerMembership.group_membership_pack_data
                        || !this.props.registerMembership.group_membership_pack_data.price}
                        primary
                        style={{ ...style.noBorderBtn.style, width: 200, margin: 10 }}
                        href={this.state.topupURL}
                        onClick={() => {
                          this.setState({
                            toppingUp: 1,
                          });
                        }}
                        target="_blank"
                      />
                    )}
                    {((this.state.isFirst || true) && this.state.toppingUp === 4) && <RaisedButton
                      label="LATER"
                      onClick={this.handleFinish}
                      style={{ ...style.noBorderBtn.style, width: 200, margin: 10 }}
                      backgroundColor={muiTheme.paper.backgroundColor}
                      labelStyle={style.noBorderBtn.labelStyle}
                    />}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {renderDialog(this.state.dialog, this.state.openDialog, this.state.closeDialogCallback || this.handleCloseDialog)}
        <Prompt message="Quá trình nạp tiền đang tiến hành. Bạn vẫn tiếp tục muốn thoát?" when={this.state.toppingUp === 1} />
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
  user: PropTypes.object,
  balance: PropTypes.object,
  registerMembership: PropTypes.object,
  updateMetadata: PropTypes.func,
  announceFn: PropTypes.func,
  history: PropTypes.object,
  isCompact: PropTypes.bool,
};

const mapStateToProps = state => ({
  communityName: state.app.community.data.name,
  groupMembershipID: state.app.community.data.groupMemberships && state.app.community.data.groupMemberships.id,
  user: state.app.metadata.data.user,
  registerMembership: state.app.metadata.data.registerMembership,
  balance: state.app.metadata.data.balance,
  isCompact: state.browser.lessThan.small,
  group_memberships: state.app.metadata.data.group_memberships,
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
