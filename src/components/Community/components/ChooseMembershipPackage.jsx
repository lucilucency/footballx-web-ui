import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import Amplitude from 'react-amplitude';
import { muiThemeable } from 'material-ui/styles';
import { FormControlLabel, RadioGroup, Checkbox, FormControl } from 'material-ui-next';
import strings from '../../../lang';
import { validate } from '../../../utils';
import { ajaxGet } from '../../../actions';

const dsGifts = {
  1: 'Sổ thành viên',
  2: 'Sổ tay',
  3: 'Bút',
  4: 'Dây đeo thẻ',
  5: 'Móc khóa',
  7: 'Vé xem Big Offline trận bất kỳ do MUSVN tổ chức (áp dụng Sài Gòn, Hà Nội)',
};

const getStyles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    alignItems: 'start',
  },
  package: {
    padding: 16,
    margin: 8,
    maxWidth: 250,
    minWidth: 150,
    borderTop: '5px solid transparent',
    // backgroundColor: theme.palette.canvasColor,
    backgroundColor: 'white',
  },
});

class ChooseMembershipPackage extends Component {
  static initFormData = {
    package: '',
  };

  static initFormValidators = {
    package: [
      { rule: 'required', message: strings.err_required },
    ],
  };

  static initFormErrors = {
    package: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: ChooseMembershipPackage.initFormData,
      formValidators: ChooseMembershipPackage.initFormValidators,
      formErrors: ChooseMembershipPackage.initFormErrors,
    };

    // if (props.user) {
    //   this.state = {
    //     formData: {
    //       package: props.user.package,
    //     },
    //     formValidators: ChooseMembershipPackage.initFormValidators,
    //     formErrors: ChooseMembershipPackage.initFormErrors,
    //   };
    // } else {
    //   this.state = {
    //     formData: ChooseMembershipPackage.initFormData,
    //     formValidators: ChooseMembershipPackage.initFormValidators,
    //     formErrors: ChooseMembershipPackage.initFormErrors,
    //   };
    // }

    this.getData = (props) => {
      ajaxGet({
        auth: true,
        path: `membership/${props.gmData.id}/packs`,
      }, (resp) => {
        try {
          const respObj = JSON.parse(resp);
          const { group_membership_packs } = respObj;
          if (group_membership_packs && group_membership_packs.length) {
            this.packages = [...group_membership_packs];
            this.forceUpdate();
          }
        } catch (err) {
          console.error(err);
        }
      });
    };
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
    if (this.props.gmData && this.props.gmData.group_id) {
      this.getData(this.props);
    }
  }

  componentWillReceiveProps(props) {
    if (props.gmData && props.gmData.group_id && JSON.stringify(props.gmData) !== JSON.stringify(this.props.gmData)) {
      this.getData(props);
    }
  }

  setFormData = (state, value) => {
    this.setState({
      formData: update(this.state.formData, {
        [state]: { $set: value },
      }),
    }, this.handleChange(state, value));
  };

  /** validate changed field */
  handleChange = (state, value) => {
    if (state && this.state.formData[state] && this.state.formValidators[state]) {
      const validators = this.state.formValidators[state];
      const fieldErrors = [];
      validators.forEach((validator) => {
        const isValidate = validate(validator.rule, value);
        if (!isValidate) {
          fieldErrors.push(validator.message);
        }
      });

      this.setState({
        formErrors: update(this.state.formErrors, {
          [state]: { $set: fieldErrors },
        }),
      }, () => {
        const err = this.getFormErrors();
        this.props.onError(err);
      });
    } else {
      this.props.onError([]);
    }
  };

  getFormData() {
    const { formData } = this.state;

    return {
      package: formData.package,
    };
  }

  getFormErrors = () => {
    const err = [];
    Object.keys(this.state.formErrors).forEach(field => err.push(...this.state.formErrors[field]));
    return err;
  };

  submit = (e) => {
    e.preventDefault();
    const errors = this.getFormErrors();
    if (errors && errors.length) {
      this.doSubmit();
    }
  };

  doSubmit = () => {
    const { props } = this;
    const submitData = this.getFormData();
    const payload = {
      ...submitData,
    };

    /** SUBMIT FLOW
     * 0. Start (trigger amplitude)
     * 1. Submit
     * */

    Amplitude.logEvent('Update user info');

    const promiseSubmit = () => new Promise((resolve) => {
      resolve(props.updateUserProfile(props.user.id, submitData, payload));
    });

    promiseSubmit().then((respSubmit) => {
      if (respSubmit.type && respSubmit.type.indexOf('OK') === -1) {
        props.callback(false);
      } else {
        props.callback(true);
      }
    });
  };

  renderPackage = (data) => {
    const gifts = JSON.parse(data.gifts);
    const isPicked = `package${data.id}` === this.state.formData.package;

    return (
      <div
        style={{
          ...getStyles(this.props.muiTheme).package,
          borderColor: isPicked ? 'red' : 'transparent',
        }}
      >
        <div className="text-big">{data.name}</div>
        <div className="text-small">Price: {data.price}</div>
        <div>{data.description}</div>
        <div style={{ height: 200 }}>
          {gifts && gifts.map(gift => (
            <div key={gift.item_id}>Item: {(`0${gift.quantity}`).slice(-2)} {dsGifts[gift.item_id]}</div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { muiTheme } = this.props;

    const styles = getStyles(muiTheme);

    return (
      <div style={styles.root}>
        <FormControl component="fieldset" required style={styles.formControl}>
          {/* <FormLabel component="legend">{strings.paragraph_update_following_communities}</FormLabel> */}
          <RadioGroup
            aria-label="gender"
            name="gender1"
            style={styles.group}
            value={this.state.formData.package}
            onChange={e => this.setFormData('package', e.target.value)}
            row
          >
            {this.packages && this.packages.map(el => (
              <FormControlLabel
                key={el.id}
                style={{ flexDirection: 'column-reverse' }}
                value={`package${el.id}`}
                control={<Checkbox />}
                label={this.renderPackage(el)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

ChooseMembershipPackage.propTypes = {
  setTrigger: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,

  /**/
  gmData: PropTypes.object,
  muiTheme: PropTypes.object,
};

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  loading: state.app.posts.loading,
  gmData: state.app.groupMemberships.data,
});

export default compose(
  connect(mapStateToProps, null),
  muiThemeable(),
)(ChooseMembershipPackage);
