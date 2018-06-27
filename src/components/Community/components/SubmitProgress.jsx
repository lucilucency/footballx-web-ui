import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { muiThemeable } from 'material-ui/styles';
import strings from '../../../lang';
import { validate } from '../../../utils';
import { ajaxPost, localUpdateMetadata } from '../../../actions';

const getStyles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
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

class SubmitProgress extends Component {
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
      formData: SubmitProgress.initFormData,
      formValidators: SubmitProgress.initFormValidators,
      formErrors: SubmitProgress.initFormErrors,
    };

    this.submitProgress = (nextProps) => {
      ajaxPost({
        path: `membership/${nextProps.gmData.id}/process`,
        params: props.registerMembership,
      }, (err, res) => {
        if (res.ok && res.text) {
          try {
            const { membership_process } = JSON.parse(res.text);
            props.updateMetadata({
              registerMembership: {
                ...props.registerMembership,
                ...membership_process,
              },
            });
          } catch (parseErr) {
            console.error(parseErr);
          }
        }
      });
    };
  }

  componentDidMount() {
    // this.props.setTrigger(this.submit);
    if (!this.props.registerMembership.id) {
      this.submitProgress(this.props);
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

  render() {
    const { muiTheme } = this.props;

    const styles = getStyles(muiTheme);

    return (
      <div style={styles.root}>
        <div>Congratulate! Be Red Devil now</div>
        {this.props.registerMembership && <div>Your process ID: {this.props.registerMembership.id}</div>}
      </div>
    );
  }
}

SubmitProgress.propTypes = {
  // setTrigger: PropTypes.func.isRequired,
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
)(SubmitProgress);
