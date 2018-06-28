import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { muiThemeable } from 'material-ui/styles';
import { FormControl } from 'material-ui-next';
import { SelectField, MenuItem, TextField } from 'material-ui';
import { format } from 'util';
import strings from '../../../lang';
import { validate, getCookie } from '../../../utils';
import { ajaxGet, ajaxPost, announce, localUpdateMetadata } from '../../../actions';
import { provincesArr, wardsArr, districtsArr } from '../../../fxconstants';

const getStyles = theme => ({
  root: {
    display: 'flex',
    // justifyContent: 'center',
    WebkitFlexWrap: 'wrap',
    flexWrap: 'wrap',
    backgroundColor: theme.paper.backgroundColor,
    padding: theme.spacing.desktopGutterLess,
  },
  formControl: {
    marginLeft: theme.spacing.desktopGutterMini,
    marginRight: theme.spacing.desktopGutterMini,
    minWidth: 200,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    alignItems: 'start',
  },
  noBorder: {
    border: `1px solid ${theme.palette.borderColor}`,
    borderRadius: 4,
    padding: '0 8px',
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
  },
});

class ChoosePlace extends Component {
  static initFormData = {
    name: '', phone: '', province_id: '', district_id: '', ward_id: '', address: '',
  };

  static initFormValidators = {
    name: [
      { rule: 'required', message: strings.err_required },
      { rule: 'minStringLength:5', message: format(strings.err_minimum, 5) },
      { rule: 'maxStringLength:30', message: format(strings.err_minimum, 30) },
    ],
    phone: [
      { rule: 'required', message: strings.err_required },
      { rule: 'isPhone', message: strings.err_invalid_phone },
    ],
    address: [
      { rule: 'required', message: strings.err_required },
      { rule: 'minStringLength:10', message: format(strings.err_minimum, 10) },
      { rule: 'maxStringLength:50', message: format(strings.err_minimum, 50) },
    ],
    province_id: [
      { rule: 'required', message: strings.err_required },
    ],
    district_id: [
      { rule: 'required', message: strings.err_required },
    ],
    ward_id: [
      { rule: 'required', message: strings.err_required },
    ],
  };

  static initFormErrors = {
    name: [], phone: [], province_id: [], district_id: [], ward_id: [], address: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: ChoosePlace.initFormData,
      formValidators: ChoosePlace.initFormValidators,
      formErrors: ChoosePlace.initFormErrors,
    };

    this.getData = (nextProps) => {
      ajaxGet({
        auth: true,
        path: `xuser/${getCookie('user_id')}/addresses`,
      }, (resp) => {
        try {
          const respObj = JSON.parse(resp);
          const { xuser_addresses } = respObj;
          if (xuser_addresses && xuser_addresses.length) {
            const userAddress = xuser_addresses[xuser_addresses.length - 1];
            this.setState({
              formData: update(this.state.formData, {
                name: { $set: userAddress.name },
                phone: { $set: userAddress.phone },
                province_id: { $set: userAddress.province_id },
                district_id: { $set: userAddress.district_id },
                ward_id: { $set: userAddress.ward_id },
                address: { $set: userAddress.address },
              }),
            }, nextProps.onError([]));
          }
        } catch (err) {
          console.error(err);
        }
      });
    };
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
    this.getData(this.props);
  }

  setFormData = (state, value) => {
    this.setState({
      formData: update(this.state.formData, {
        [state]: { $set: value },
      }),
    }, this.validateField(state, value));
  };

  getFormData() {
    const { formData } = this.state;

    return {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      province_id: formData.province_id,
      district_id: formData.district_id,
      ward_id: formData.ward_id,
    };
  }

  getFormErrors = () => {
    const err = [];
    Object.keys(this.state.formErrors).forEach(field => err.push(...this.state.formErrors[field]));
    return err;
  };

  /** validate field after set */
  validateField = (state, value, callback) => {
    if (state && this.state.formValidators[state]) {
      const validators = this.state.formValidators[state];
      const fieldErrors = [];
      validators.forEach((validator) => {
        const isValidate = validate(validator.rule, value);
        if (!isValidate) {
          fieldErrors.push(validator.message);
        }
      });

      if (callback) callback(fieldErrors);

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
      if (callback) callback([]);
    }
  };

  validateAll = (callback) => {
    const validators = Object.keys(this.state.formData).map((state) => {
      const value = this.state.formData[state];
      return new Promise((resolve) => {
        this.validateField(state, value, err => resolve(err));
      });
    });

    Promise.all(validators).then((resp) => {
      const errors = [];
      resp.forEach(el => el && el.length && errors.concat(el));
      callback(errors);
    });
  };

  submit = (e) => {
    e.preventDefault();

    this.validateAll((errors) => {
      if (!errors.length) {
        this.doSubmit();
      }
    });
  };

  /** SUBMIT FLOW
   * 0. Start (trigger amplitude)
   * 1. Submit
   * 2. Update metadata
   * */
  doSubmit = () => {
    const { props } = this;
    const submitData = this.getFormData();

    const promiseSubmit = () => new Promise((resolve) => {
      ajaxPost({
        path: `xuser/${getCookie('user_id')}/address`,
        params: submitData,
      }, (err, res) => {
        if (res.ok && res.text) {
          try {
            const { xuser_address } = JSON.parse(res.text);
            resolve({
              data: xuser_address,
            });
          } catch (parseErr) {
            console.error(parseErr);
            resolve({
              error: JSON.stringify(parseErr),
            });
          }
        } else {
          resolve({
            error: (res.body && res.body.message) || 'Undefined error!',
          });
        }
      });
    });

    promiseSubmit().then(({ error, data }) => {
      if (error) {
        props.onSubmit(false);
        this.props.announce({
          message: error,
          action: 'Try again',
          autoHideDuration: 8000,
        });
      } else {
        this.props.updateMetadata({
          registerMembership: {
            ...this.props.registerMembership,
            xuser_address_id: data.id,
            xuser_address_data: data,
          },
        });
        props.onSubmit(true);
      }
    });
  };

  render() {
    const { muiTheme } = this.props;
    const { formData, formErrors } = this.state;

    const styles = getStyles(muiTheme);

    const provinceDS = provincesArr;

    const districtDS = formData.province_id ? districtsArr.filter(el => el.province_id === formData.province_id) : [];
    const wardDS = formData.district_id ? wardsArr.filter(el => el.district_id === formData.district_id) : [];

    return (
      <div style={styles.root}>
        <FormControl style={{ ...styles.formControl, width: '100%' }}>
          <TextField
            name="name"
            type="text"
            hintText={strings.hint_receive_name}
            onChange={e => this.setFormData('name', e.target.value)}
            fullWidth
            autoComplete="off"
            value={formData.name}
            errorText={formErrors.name.length ? formErrors.name[0] : null}
          />
        </FormControl>
        <FormControl style={{ ...styles.formControl, width: '100%' }}>
          <TextField
            name="phone"
            type="text"
            hintText={strings.hint_phone}
            onChange={e => this.setFormData('phone', e.target.value)}
            fullWidth
            autoComplete="off"
            value={formData.phone}
            errorText={formErrors.phone.length ? formErrors.phone[0] : null}
          />
        </FormControl>
        <FormControl style={{ ...styles.formControl, width: '100%' }}>
          <TextField
            name="address"
            type="text"
            hintText={strings.hint_address}
            onChange={e => this.setFormData('address', e.target.value)}
            fullWidth
            autoComplete="off"
            value={formData.address}
            errorText={formErrors.address.length ? formErrors.address[0] : null}
          />
        </FormControl>
        <FormControl style={styles.formControl}>
          <SelectField
            floatingLabelText={strings.label_province}
            value={formData.province_id}
            onChange={(e, index, value) => this.setFormData('province_id', value)}
            fullWidth
            errorText={formErrors.province_id.length ? formErrors.province_id[0] : null}
          >
            {provinceDS.map(el => (
              <MenuItem key={el.id} value={el.id} primaryText={el.name} />
            ))}
          </SelectField>
        </FormControl>
        <FormControl style={styles.formControl}>
          <SelectField
            floatingLabelText={strings.label_district}
            value={formData.district_id}
            onChange={(e, index, value) => this.setFormData('district_id', value)}
            fullWidth
            errorText={formErrors.district_id.length ? formErrors.district_id[0] : null}
          >
            {districtDS.map(el => (
              <MenuItem key={el.id} value={el.id} primaryText={el.name} />
            ))}
          </SelectField>
        </FormControl>
        <FormControl style={styles.formControl}>
          <SelectField
            floatingLabelText={strings.label_ward}
            value={formData.ward_id}
            onChange={(e, index, value) => this.setFormData('ward_id', value)}
            fullWidth
            errorText={formErrors.ward_id.length ? formErrors.ward_id[0] : null}
          >
            {wardDS.map(el => (
              <MenuItem key={el.id} value={el.id} primaryText={el.name} />
            ))}
          </SelectField>
        </FormControl>
      </div>
    );
  }
}

ChoosePlace.propTypes = {
  setTrigger: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,

  /**/
  muiTheme: PropTypes.object,
  registerMembership: PropTypes.object,
  announce: PropTypes.func,
  updateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  registerMembership: state.app.metadata.data.registerMembership,
});

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(ChoosePlace);
