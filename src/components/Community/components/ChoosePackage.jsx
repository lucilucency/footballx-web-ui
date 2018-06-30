import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { muiThemeable } from 'material-ui/styles';
import { FormControlLabel, RadioGroup, Checkbox, FormControl, Divider } from 'material-ui-next';
import strings from '../../../lang';
import { validate, numberWithCommas } from '../../../utils';
import constants from '../../constants';
import { localUpdateMetadata } from '../../../actions';

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
    margin: theme.spacing.desktopGutterLess,
  },
  group: {
    marginLeft: theme.spacing.desktopGutterMini,
    marginRight: theme.spacing.desktopGutterMini,
    justifyContent: 'center',
    alignItems: 'start',
  },
  package: {
    padding: 16,
    margin: 8,
    maxWidth: 250,
    minWidth: 150,
    borderTop: '5px solid transparent',
    backgroundColor: theme.paper.backgroundColor,
  },
});

class ChooseMembershipPackage extends Component {
  static initFormData = {
    package: null,
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
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
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
      group_membership_pack_id: formData.package,
    };
  }

  getFormErrors = () => {
    const err = [];
    Object.keys(this.state.formErrors).forEach(field => err.push(...this.state.formErrors[field]));
    return err;
  };

  /** validate changed field */
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

    const packID = Number(submitData.group_membership_pack_id);
    const pack = this.props.groupMembershipPackages.find(el => el.id === packID);

    this.props.updateMetadata({
      registerMembership: {
        ...this.props.registerMembership,
        group_membership_pack_id: pack.id,
        group_membership_pack_data: pack,
      },
    });
    props.onSubmit(true);
  };

  renderPackage = (data, style) => {
    const gifts = JSON.parse(data.gifts);
    const isPicked = data.id === this.state.formData.package;

    return (
      <div
        style={{
          ...style.package,
          borderColor: isPicked ? this.props.muiTheme.palette.primary2Color : 'transparent',
        }}
      >
        <div className="font-normal">{data.name}</div>
        <Divider style={{ height: '3px', backgroundColor: this.props.muiTheme.palette.primary2Color }} />
        <div>{data.description}</div>
        <ul style={{ height: 200 }}>
          {gifts && gifts.map(gift => (
            <li style={{ listStyleType: 'disc' }} key={gift.item_id}>{(`0${gift.quantity}`).slice(-2)} {dsGifts[gift.item_id]}</li>
          ))}
        </ul>
        <div style={{ fontSize: constants.fontSizeSmall, textAlign: 'center' }}>Price: {numberWithCommas(data.price)}</div>
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
            {this.props.groupMembershipPackages && this.props.groupMembershipPackages.map(el => (
              <FormControlLabel
                key={el.id}
                style={{ flexDirection: 'column-reverse' }}
                value={el.id.toString()}
                control={<Checkbox />}
                label={this.renderPackage(el, styles)}
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
  muiTheme: PropTypes.object,
  groupMembershipPackages: PropTypes.array,
  registerMembership: PropTypes.object,
  updateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  groupMembershipPackages: state.app.community.data.groupMembershipPackages,
  registerMembership: state.app.metadata.data.registerMembership,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(ChooseMembershipPackage);
