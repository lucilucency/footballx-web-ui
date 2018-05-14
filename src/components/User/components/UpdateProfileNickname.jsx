import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { format } from 'util';
import strings from '../../../lang';
import { FormWrapper, TextValidator } from '../../../utils';
import constants from '../../constants';
import { updateMetadata } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';

class UpdateProfileNickname extends React.Component {
  static defaultProps = {
    display: true,
    toggle: false,
    popup: false,
    loading: false,
  };

  static defaultFormData = {
    title: '',
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

  updateTitle = (e) => {
    this.setState({
      formData: update(this.state.formData, {
        title: { $set: e.target.value },
      }),
    }, this.handleChange);
  };

  handleChange = () => {
    this.props.onChange(this.isValid());
  };

  isValid = () => !this.isExistNickname();

  isExistNickname = () => false;

  submit = () => {
    if (this.isValid()) {
      this.props.updateMetadata({
        ...this.props.user,
        username: this.state.formData.title,
      });
      this.props.callback();
    } else {
      //
    }
  };

  render() {
    const {
      display,
      toggle,
      popup,
      loading,
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
          {loading && <Spinner />}
          {this.state.error && <Error text={this.state.error} />}

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
              name="title"
              type="text"
              hintText={strings.hint_nickname}
              onChange={this.updateTitle}
              fullWidth
              autoComplete="off"
              underlineShow={false}
              value={this.state.formData.title}
              validators={['required', 'maxStringLength:20']}
              errorMessages={[strings.err_is_required, format(strings.err_maximum, 20)]}
            />
          </div>
        </FormWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  // loading: state.app.posts.loading,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(updateMetadata(payload)),
});

UpdateProfileNickname.propTypes = {
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  callback: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,

  /**/
  loading: PropTypes.bool,
  user: PropTypes.object,
  updateMetadata: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileNickname);
