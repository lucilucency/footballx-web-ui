import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { format } from 'util';
import Amplitude from 'react-amplitude';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { FormGroup, FormControlLabel, Radio, RadioGroup, TextField } from 'material-ui-next';
import strings from '../../../lang';
import { FormWrapper, TextValidator, validate } from '../../../utils';
import ui from '../../../theme';
import { updateMetadata, updateUserProfile } from '../../../actions';

const toPickerDate = (date) => {
  const patt = new RegExp('(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])/([0-9]{4})');
  if (date && date.length && patt.test(date)) {
    const dateSplit = date.split('/');
    return `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
  }

  return null;
};

const toDatabaseDate = (date) => {
  const patt = new RegExp('([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])');
  if (date && date.length && patt.test(date)) {
    const dateSplit = date.split('-');
    return `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
  }

  return null;
};

class UpdateUserInfo extends Component {
  static initFormData = {
    fullname: '',
    phone: '',
    email: '',
    gender: '',
    birthday: '',
    /* xuser-address */
    address: null,
    province_id: null,
    district_id: null,
    ward_id: null,
  };

  static initFormValidators = {
    fullname: [
      { rule: 'minStringLength:5', message: format(strings.err_minimum, 5) },
      { rule: 'maxStringLength:32', message: format(strings.err_maximum, 32) },
    ],
    email: [
      { rule: 'required', message: strings.err_required },
      { rule: 'isEmail', message: strings.err_invalid_email },
    ],
    phone: [
      { rule: 'required', message: strings.err_required },
      { rule: 'isPhone', message: strings.err_invalid_phone },
    ],
  };

  static initFormErrors = {
    fullname: [], email: [], phone: [],
  };

  constructor(props) {
    super(props);

    if (props.user) {
      this.state = {
        formData: {
          fullname: props.user.fullname,
          phone: props.user.phone,
          email: props.user.email,
          birthday: props.user.birthday,
          gender: props.user.gender,
        },
        formValidators: UpdateUserInfo.initFormValidators,
        formErrors: UpdateUserInfo.initFormErrors,
      };
      props.onChange([]);
    } else {
      this.state = {
        formData: UpdateUserInfo.initFormData,
        formValidators: UpdateUserInfo.initFormValidators,
        formErrors: UpdateUserInfo.initFormErrors,
      };
    }
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
  }

  setFormData = (state, value) => {
    this.setState({
      formData: update(this.state.formData, {
        [state]: { $set: value },
      }),
    }, this.handleChange(state, value));
  };

  getFormData() {
    const { formData } = this.state;

    return {
      fullname: formData.fullname,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthday: toDatabaseDate(formData.birthday),
    };
  }

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
        const err = [];
        Object.keys(this.state.formErrors).forEach(field => err.push(...this.state.formErrors[field]));
        this.props.onChange(err);
      });
    }
  };

  submit = (e) => {
    e.preventDefault();

    if (!this.state.formData.error.length) {
      this.doSubmit();
    }
  };

  doSubmit = () => {
    const { props } = this;
    const submitData = this.getFormData();
    const payload = {
      ...this.props.user,
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

  render() {
    const { formData } = this.state;
    const {
      display,
      toggle,
      popup,
      // loading,
    } = this.props;

    const noBorderStyle = {
      border: `1px solid ${ui.borderColor}`,
      borderRadius: 4,
      padding: '0 8px',
      marginBottom: 8,
      marginLeft: 8,
      marginRight: 8,
    };

    return (
      <FormWrapper
        data-toggle={toggle}
        data-popup={popup}
        data-display={display}
        onSubmit={this.submit}
        style={{
          backgroundColor: ui.surfaceColorPrimary,
        }}
      >
        <FormGroup>
          <div style={noBorderStyle}>
            <TextValidator
              name="fullname"
              type="text"
              hintText={strings.hint_fullname}
              onChange={e => this.setFormData('fullname', e.target.value)}
              fullWidth
              autoComplete="off"
              underlineShow={false}
              value={formData.fullname}
              validators={['minStringLength:5', 'maxStringLength:32']}
              errorMessages={[format(strings.err_minimum, 5), format(strings.err_maximum, 32)]}
              errorText={this.state.error}
            />
          </div>
          <div style={noBorderStyle}>
            <TextValidator
              name="email"
              type="text"
              hintText={strings.hint_email}
              onChange={e => this.setFormData('email', e.target.value)}
              fullWidth
              autoComplete="off"
              underlineShow={false}
              value={formData.email}
              validators={['required', 'isEmail']}
              errorMessages={[strings.err_required, strings.err_invalid_email]}
            />
          </div>
        </FormGroup>
        <FormGroup row>
          <div style={noBorderStyle}>
            <TextValidator
              name="phone"
              type="text"
              hintText={strings.hint_phone}
              onChange={e => this.setFormData('phone', e.target.value)}
              fullWidth
              autoComplete="off"
              underlineShow={false}
              value={formData.phone}
              validators={['isPhone']}
              errorMessages={[strings.err_invalid_phone]}
            />
          </div>
          <TextField
            id="date"
            label="Birthday"
            type="date"
            value={toPickerDate(formData.birthday)}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => this.setFormData('birthday', e.target.value)}
            style={{
              marginLeft: 16,
              marginRight: 16,
            }}
          />
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={formData.gender}
            onChange={e => this.setFormData('gender', e.target.value)}
            row
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormGroup>
      </FormWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user,
});

UpdateUserInfo.propTypes = {
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  // callback: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setTrigger: PropTypes.func.isRequired,

  /**/
  user: PropTypes.object,
  // updateMetadata: PropTypes.func,
  // updateUserProfile: PropTypes.func,
};

UpdateUserInfo.defaultProps = {
  display: true,
  toggle: false,
  popup: false,
};

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(updateMetadata(payload)),
  updateUserProfile: (userID, params, payload) => dispatch(updateUserProfile(userID, params, payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(UpdateUserInfo);
