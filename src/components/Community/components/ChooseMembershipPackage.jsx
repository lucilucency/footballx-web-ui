import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { muiThemeable } from 'material-ui/styles';
import { FormControlLabel, RadioGroup, Checkbox, FormControl } from 'material-ui-next';
import strings from '../../../lang';
import { validate } from '../../../utils';
import { ajaxGet, localUpdateMetadata } from '../../../actions';

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

    this.getData = (nextProps) => {
      ajaxGet({
        auth: true,
        path: `membership/${nextProps.gmData.id}/packs`,
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

    const { group_membership_pack_id } = submitData;

    this.props.updateMetadata({
      registerMembership: {
        ...this.props.registerMembership,
        group_membership_pack_id,
      },
    });
    props.onSubmit(true);
  };

  renderPackage = (data) => {
    const gifts = JSON.parse(data.gifts);
    const isPicked = `package${data.id}` === this.state.formData.package;

    return (
      <div
        style={{
          ...getStyles(this.props.muiTheme).package,
          borderColor: isPicked ? this.props.muiTheme.palette.primary2Color : 'transparent',
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
                value={el.id.toString()}
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
  muiTheme: PropTypes.object,
  gmData: PropTypes.object,
  registerMembership: PropTypes.object,
  updateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  gmData: state.app.groupMemberships.data,
  registerMembership: state.app.metadata.data.registerMembership,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(ChooseMembershipPackage);
