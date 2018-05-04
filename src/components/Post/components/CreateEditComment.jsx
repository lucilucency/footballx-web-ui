/* eslint-disable react/forbid-prop-types,max-len,no-confusing-arrow,no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  FlatButton,
  TextField,
} from 'material-ui';

import strings from '../../../lang';
import { bindAll, mergeObject, FormWrapper } from '../../../utils';
import { createComment as defaultCreateFn } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';

class CreateEditPost extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,

    postID: PropTypes.number,
    user: PropTypes.object,
    /* function */
    defaultDeleteFunction: PropTypes.func,
  };

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
      ...CreateEditPost.defaultFormData,
    },
    submitResults: {
      data: [],
      show: false,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      ...CreateEditPost.initialState,
    };
    bindAll([
      'getFormData',
      'submit',
      'deleteComment',
      'closeDialog',
    ], this);
  }

  componentDidMount() {
    this.contentInput.focus();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === 'edit' && newProps.data && newProps.data.id) {
      const getType = () => {
        const find = newProps.dsPostType.find(o => o.value === Number(newProps.data.content_type));
        return find ? find.text : '';
      };

      const { data } = newProps;
      this.setState({
        formData: mergeObject(CreateEditPost.defaultFormData, {
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
    this.setState(CreateEditPost.initialState);
  }

  submit(e) {
    e.preventDefault();

    const that = this;
    const { mode } = this.props;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createFn = that.props.dispatch ? that.props.dispatch : that.props.defaultCreateFunction;
      const editFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doSubmit = new Promise((resolve) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
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
          resolve(editFn(that.props.data.id, submitData));
        } else {
          resolve(createFn({
            post_id: this.props.postID,
            submit_data: submitData,
            payload: {
              xuser: this.props.user,
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
              formData: CreateEditPost.defaultFormData,
            }, () => {
              this.contentInput.focus();
            });
          }
        } else {
          resultsReport.push({
            submitAction: mode === 'edit' ? 'Update post failed' : 'Create post failed',
            submitting: false,
            error: results[0].error,
          });
        }

        that.setState({
          submitResults: update(that.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  deleteComment() {
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

    const renderContentInput = () => (<TextField
      key="content"
      type="text"
      ref={(el) => {
        this.contentInput = el;
      }}
      hintText={strings.hint_comment}
      onChange={e => this.setState({
        formData: update(this.state.formData, {
          content: { $set: e.target.value },
        }),
      })}
      rowsMax={4}
      fullWidth
      value={this.state.formData.content && this.state.formData.content}
      hintStyle={{ top: 12 }}
      autoComplete="off"
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
      null && (
        <FlatButton
          key="submit"
          type="submit"
          label={strings.form_general_submit}
          primary
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

        <div>
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
  defaultCreateFunction: (postID, params) => dispatch(defaultCreateFn(postID, params)),
  defaultEditFunction: () => {},
  defaultDeleteFunction: () => {},
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditPost));
