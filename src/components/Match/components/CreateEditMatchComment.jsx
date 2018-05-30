import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  FlatButton,
  RaisedButton,
} from 'material-ui';
import constants from '../../constants';
import strings from '../../../lang';
import { bindAll, mergeObject, FormWrapper, TextValidator } from '../../../utils';
import { createMatchComment } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';

class CreateEditComment extends React.Component {
  static defaultProps = {
    mode: 'create',
    display: true,
    toggle: false,
    popup: false,
    loading: false,
  };

  static defaultFormData = {
    title: '',
    content: '',
    content_type: {
      text: strings.enum_post_type_1,
      value: 1,
    },
  };

  static initialState = ({
    formData: {
      ...CreateEditComment.defaultFormData,
    },
    submitResults: {
      data: [],
      show: false,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      ...CreateEditComment.initialState,
    };
    bindAll([
      'getFormData',
      'submit',
      'deleteComment',
      'closeDialog',
    ], this);
  }

  componentDidMount() {
    // this.contentInput.focus();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === 'edit' && newProps.data && newProps.data.id) {
      const getType = () => {
        const find = newProps.dsPostType.find(o => o.value === Number(newProps.data.content_type));
        return find ? find.text : '';
      };

      const { data } = newProps;
      this.setState({
        formData: mergeObject(CreateEditComment.defaultFormData, {
          comment_id: { value: data.id },
          title: data.title,
          content: data.content,
          content_type: { value: data.type, text: getType() },
        }),
      });
    }
  }

  getFormData() {
    const { formData } = this.state;

    return {
      // title: formData.title,
      content: formData.content,
      // content_type: formData.content_type.value || 1,
    };
  }

  clearFormData() {
    this.setState(CreateEditComment.initialState);
  }

  submit(e) {
    e.preventDefault();

    const { mode } = this.props;

    const doSubmit = new Promise((resolve) => {
      this.setState({
        submitResults: update(this.state.submitResults, {
          data: {
            $push: [{
              submitAction: mode === 'edit' ? 'Updating comment' : 'Creating comment',
              submitting: true,
            }],
          },
        }),
      });
      const submitData = this.getFormData();
      if (mode === 'edit') {
        // resolve(this.props.defaultEditFunction(this.props.data.id, submitData));
      } else {
        resolve(this.props.createMatchComment(this.props.post.id, {
          params: {
            ...submitData,
            target_id: this.props.post.id,
          },
          payload: {
            xuser: this.props.user,
          },
          payloadCallback: {
            ...this.props.post,
            c_comments: (this.props.post.c_comments || 0) + 1,
          },
        }));
      }
    });

    Promise.all([doSubmit]).then((results) => {
      const resultsReport = [];
      if (results[0].type.indexOf('OK') === 0) {
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
        if (mode === 'create') {
          this.setState({
            formData: CreateEditComment.defaultFormData,
          }, () => {
            // this.contentInput.focus();
          });
        }
      } else {
        resultsReport.push({
          submitAction: mode === 'edit' ? 'Update post failed' : 'Create post failed',
          submitting: false,
          error: results[0].error,
        });
      }

      this.setState({
        submitResults: update(this.state.submitResults, {
          data: { $set: resultsReport },
        }),
      });
    });
  }

  deleteComment() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this post?')) {
      this.setState({
        submitResults: update(this.state.submitResults, {
          show: { $set: true },
        }),
      }, () => {
        const doSubmit = new Promise((resolve) => {
          this.setState({
            submitResults: update(this.state.submitResults, {
              data: {
                $push: [{
                  submitAction: 'Deleting hotspot...',
                  submitting: true,
                }],
              },
            }),
          });
          resolve(this.props.defaultDeleteFunction(this.state.formData.post_id.value));
        });

        Promise.all([doSubmit]).then((results) => {
          const resultsReport = [];
          if (results[0].type.indexOf('OK') === 0) {
            resultsReport.push({
              submitAction: 'Delete post successfully',
              submitting: false,
            });
          } else {
            resultsReport.push({
              submitAction: 'Delete post failed',
              submitting: false,
              error: results[0].error,
            });
          }
          this.setState({
            submitResults: update(this.state.submitResults, {
              data: { $set: resultsReport },
            }),
          });
        });
      });
    } else {
      // Do nothing!
    }
  }

  closeDialog() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  render() {
    const {
      mode,
      display,
      toggle,
      popup,
      loading,
    } = this.props;

    const renderContentInput = () => (<TextValidator
      // floatingLabelText={strings.hint_comment}
      name="comment_content"
      key="content"
      type="text"
      hintText={this.props.post.c_comments ? strings.hint_comment : 'Be the first one bark here'}
      hintStyle={{ top: 12 }}
      onChange={e => this.setState({
        formData: update(this.state.formData, {
          content: { $set: e.target.value },
        }),
      })}
      multiLine
      rows={4}
      rowsMax={10}
      fullWidth
      value={this.state.formData.content && this.state.formData.content}
      autoComplete="off"
      underlineShow={false}
      validators={['required']}
      errorMessages={[strings.err_empty_comment_content]}
    />);

    const actions = [
      mode === 'edit' && (
        <FlatButton
          key="delete"
          label={strings.form_general_delete}
          secondary
          onClick={this.deletePost}
          style={{ float: 'left' }}
        />
      ),
      (
        <RaisedButton
          key="submit"
          type="submit"
          label={strings.label_comment}
          style={{
            margin: 5,
          }}
          buttonStyle={{
            height: '32px',
            lineHeight: '32px',
          }}
          primary
          disabled={!this.state.formData.content.length}
        />
      ),
    ];

    return (
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
            backgroundColorPrimary: 'hsla(0,0%,100%,0)',
            border: `1px solid ${constants.grey200}`,
            borderRadius: 2,
            padding: '0 10px',
          }}
        >
          {renderContentInput()}
        </div>

        <div className="actions">
          {actions}
        </div>
      </FormWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  dsPostType: [{
    text: strings.enum_post_type_1,
    value: 1,
  }, {
    text: strings.enum_post_type_2,
    value: 2,
  }, {
    text: strings.enum_post_type_3,
    value: 3,
  }],
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  createMatchComment: (matchID, args) => dispatch(createMatchComment(matchID, args)),
  defaultEditFunction: () => {},
  defaultDeleteFunction: () => {},
});

CreateEditComment.propTypes = {
  post: PropTypes.object.isRequired,
  // data: PropTypes.object, /* comment's data */

  mode: PropTypes.string,
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  /**/
  user: PropTypes.object,
  loading: PropTypes.bool,
  defaultDeleteFunction: PropTypes.func,
  createMatchComment: PropTypes.func,
  // defaultEditFunction: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditComment));
