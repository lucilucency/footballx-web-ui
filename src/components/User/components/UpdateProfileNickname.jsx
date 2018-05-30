import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { format } from 'util';
import strings from '../../../lang';
import { FormWrapper, TextValidator, PasswordWithEye } from '../../../utils';
import constants from '../../constants';
import { updateMetadata, updateUserProfile } from '../../../actions';
// import Spinner from '../../Spinner/index';

class UpdateProfileNickname extends Component {
  static defaultProps = {
    display: true,
    toggle: false,
    popup: false,
    // loading: false,
  };

  static defaultFormData = {
    username: '',
    password: '',
  };

  static initialState = ({
    type: 'text',
    formData: {
      ...UpdateProfileNickname.defaultFormData,
    },
    submitting: false,
    submitResp: [],
  });

  constructor(props) {
    super(props);

    this.state = {
      ...UpdateProfileNickname.initialState,
    };
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
  }

  updateTitle = (e) => {
    this.setState({
      formData: update(this.state.formData, {
        username: { $set: e.target.value },
      }),
      error: '',
    }, this.handleChange);
  };

  updatePassword = (e) => {
    this.setState({
      formData: update(this.state.formData, {
        password: { $set: e.target.value },
      }),
    }, this.handleChange);
  };

  handleChange = () => {
    this.props.onChange(this.isValid());
  };

  isExistNickname = () => false;
  isValid = () => !this.isExistNickname();

  submit = () => {
    // if (this.isValid()) {}

    // this.props.updateMetadata({
    //   user: {
    //     ...this.props.user,
    //     username: this.state.formData.username,
    //   },
    // });
    this.props.updateUserProfile(this.props.user.id, {
      username: this.state.formData.username,
      // password: this.state.formData.password,
    }, {
      ...this.props.user,
      username: this.state.formData.username,
    }).then((resp) => {
      if (resp.type && resp.type.indexOf('OK') === -1) {
        this.setState({
          error: 'Invalid nickname or nickname already exist.',
        }, () => {
          this.props.callback(false);
        });
      } else {
        this.props.callback(true);
      }
    });

    // this.props.callback();
  };

  render() {
    const {
      display,
      toggle,
      popup,
      // loading,
    } = this.props;

    return (
      <div>
        <FormWrapper
          data-toggle={toggle}
          data-popup={popup}
          data-display={display}
          onSubmit={this.submit}
          // onError={errors => console.log(errors)}
        >
          {/* {loading && <Spinner />} */}
          {(
            <div>
              <div
                style={{
                  backgroundColor: 'hsla(0,0%,100%,0)',
                  border: `1px solid ${constants.grey200}`,
                  borderRadius: 4,
                  padding: '0 10px',
                  marginBottom: 10,
                }}
              >
                <TextValidator
                  name="username"
                  type="text"
                  hintText={strings.hint_nickname}
                  onChange={this.updateTitle}
                  fullWidth
                  autoComplete="off"
                  underlineShow={false}
                  value={this.state.formData.username}
                  validators={['required', 'maxStringLength:20', 'noSpace']}
                  errorMessages={[strings.err_is_required, format(strings.err_maximum, 20), 'Invalid username: no space']}
                  errorText={this.state.error}
                />
              </div>
              {null && (
                <div
                  style={{
                    backgroundColor: 'hsla(0,0%,100%,0)',
                    border: `1px solid ${constants.grey200}`,
                    borderRadius: 4,
                    padding: '0 10px',
                    marginBottom: 10,
                  }}
                >
                  <PasswordWithEye
                    name="password"
                    type="password"
                    hintText={strings.hint_password}
                    onChange={this.updatePassword}
                    fullWidth
                    autoComplete="off"
                    underlineShow={false}
                    value={this.state.formData.password}
                    // errorText="Your password is too short"
                    // validators={['required', 'maxStringLength:16']}
                    // errorMessages={[strings.err_is_required, format(strings.err_maximum, 16)]}
                  />
                </div>
              )}
            </div>
          )}
        </FormWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(updateMetadata(payload)),
  updateUserProfile: (userID, params, payload) => dispatch(updateUserProfile(userID, params, payload)),
});

UpdateProfileNickname.propTypes = {
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  callback: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setTrigger: PropTypes.func.isRequired,

  /**/
  // loading: PropTypes.bool,
  user: PropTypes.object,
  // updateMetadata: PropTypes.func,
  updateUserProfile: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileNickname);
