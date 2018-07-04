/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  FlatButton,
  RaisedButton,
} from 'material-ui';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import clubs from '../../../fxconstants/clubsArr.json';
import constants from '../../constants';
import strings from '../../../lang';
import { bindAll, FormWrapper, TextValidator } from '../../../utils';
import { commentInPost } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';
import ui from '../../../theme';

class CreateEditComment extends React.Component {
  static defaultFormData = {
    content: '',
  };

  static initialState = ({
    formData: {
      ...CreateEditComment.defaultFormData,
    },
    wysiwyg: EditorState.createEmpty(),
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
      'close',
    ], this);
  }

  componentDidMount() {
    // this.contentInput.focus();
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.mode === 'edit' && newProps.data && newProps.data.id) {
  //     const { data } = newProps;
  //     this.setState({
  //       formData: mergeObject(CreateEditComment.defaultFormData, {
  //         comment_id: { value: data.id },
  //         title: data.title,
  //         content: data.content,
  //       }),
  //     });
  //   }
  // }

  close() {
    if (this.props.callback) {
      this.props.callback();
    }
  }

  getFormData = () => {
    const { formData } = this.state;

    return {
      // title: formData.title,
      content: draftToMarkdown(convertToRaw(this.state.wysiwyg.getCurrentContent())),
      created_at: parseInt(Date.now() / 1000, 10),
      // content_type: formData.content_type.value || 1,
    };
  };

  getPayload = (submitData) => {
    const pushItUp = (comments) => {
      comments.forEach((el) => {
        el.comments = el.comments || [];
        if (el.id === this.props.target.id) {
          el.comments.push(submitData);
        } else {
          pushItUp(el.comments);
        }
      });
    };
    return pushItUp(this.props.comments);
  };

  submit(e) {
    e.preventDefault();
    const { mode } = this.props;
    const submitData = this.getFormData();

    const promiseSubmit = () => new Promise((resolve) => {
      if (mode === 'edit') {
        /* resolve edit function */
      } else {
        let reducer = 'ADD/comments';
        let payload = { xuser: this.props.user };
        const reducerCallback = [];
        const payloadCallback = [];
        if (!this.props.target.target_id) { /* comment in post */
          reducerCallback.push('EDIT/post');
          payloadCallback.push({
            ...this.props.target,
            c_comments: (this.props.target.c_comments || 0) + 1,
          });
        }
        if (this.props.target.target_id !== this.props.target.parent_id) { /* comment in comment */
          reducer = 'EDIT/comments';
          payload = this.getPayload({
            ...submitData,
            xuser: this.props.user,
          });
          reducerCallback.push('EDIT_LOCAL', 'EDIT_ARR/posts');
          payloadCallback.push({
            c_comments: (this.props.target.c_comments || 0) + 1,
          }, {
            ...this.props.target,
            c_comments: (this.props.target.c_comments || 0) + 1,
          });
        }

        resolve(this.props.createComment({
          params: {
            ...submitData,
            target_id: this.props.target.id,
          },
          reducer,
          payload,
          reducerCallback,
          payloadCallback,
        }));
      }
    });

    promiseSubmit().then((results) => {
      if (results.type.indexOf('OK') === 0) {
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
        if (mode === 'create') {
          this.setState({
            formData: CreateEditComment.defaultFormData,
          }, this.close);
        }
      } else {
        /* announce about fail */
      }
    });
  }

  deleteComment() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this comment?')) {
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
                  submitAction: 'Deleting comment...',
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

  getFormError = () => {
    // return false;
  };

  updateFormData = (state, value, callback) => {
    this.setState({
      formData: update(this.state.formData, {
        [state]: { $set: value },
      }),
    }, () => {
      this.getFormError();
      if (callback) callback();
    });
  };

  onWysiwygChange = (wysiwyg) => {
    this.setState({
      wysiwyg,
    });
  };

  renderContentInput = () => (<TextValidator
    // floatingLabelText={strings.hint_comment}
    name="comment_content"
    key="content"
    type="text"
    hintText={strings.hint_comment}
    hintStyle={{ top: 12 }}
    onChange={e => this.updateFormData('content', e.target.value)}
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

  renderRichTextInput = () => {
    const suggestions = clubs ? clubs.map(club => ({
      text: club.name,
      value: club.name,
      url: `/t/${club.id}`,
    })) : [];

    return (
      <div>
        {/* <textarea
         cols={80}
         rows={10}
         disabled
         value={this.state.wysiwyg && draftToMarkdown(convertToRaw(this.state.wysiwyg.getCurrentContent()))}
         /> */}
        <Editor
          // editorState={this.state.wysiwyg}
          rawContentState={this.state.wysiwyg}
          stripPastedStyles
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onWysiwygChange}
          placeholder={strings.hint_post_content_text}
          mention={{
            separator: ' ',
            trigger: '@',
            suggestions,
          }}
          hashtag={{
            separator: ' ',
            trigger: '#',
          }}
          toolbar={{
            options: ['emoji'],
            inline: {
              options: ['bold', 'italic', 'presenterUnderline'],
            },
          }}
          toolbarStyle={{
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            marginBottom: 0,
          }}
          wrapperStyle={{
            borderTop: `2px solid ${ui.positive2Color}`,
            borderLeft: `2px solid ${ui.positive2Color}`,
            borderRight: `2px solid ${ui.positive2Color}`,
            borderBottom: `2px solid ${ui.positive2Color}`,
            borderRadius: 4,
            backgroundColor: ui.surfaceColorPrimary,
            padding: '0 0',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
          editorStyle={{
            padding: '0 20px',
            minHeight: '250px',
            lineHeight: '24px',
            fontFamily: ui.fontFamilyPrimary,
            fontStyle: 'normal',
            color: '#555555',
            fontSize: '14px',
          }}
        />
      </div>
    );
  };

  render() {
    const {
      mode,
      display,
      toggle,
      popup,
      loading,
    } = this.props;

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
        style={{
          backgroundColor: ui.surfaceColorSecondary,
          padding: '16px 70px',
        }}
        // onSubmit={this.getPayload}
        // onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}

        <div
          style={{
            backgroundColor: 'hsla(0,0%,100%,0)',
            border: `1px solid ${ui.borderColor}`,
            borderRadius: 4,
            padding: '0 10px',
            margin: 10,
          }}
        >
          {this.renderContentInput()}
        </div>

        {this.renderRichTextInput()}

        <div className="actions">
          {actions}
        </div>
      </FormWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  user: state.app.metadata.data.user,
  comments: state.app.comments.data,
});

const mapDispatchToProps = dispatch => ({
  createComment: args => dispatch(commentInPost(args)),
  defaultEditFunction: () => {},
  defaultDeleteFunction: () => {},
});

CreateEditComment.propTypes = {
  target: PropTypes.object.isRequired,
  // data: PropTypes.object, /* comment's data for editing */
  mode: PropTypes.string,
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  callback: PropTypes.func,
  /**/
  user: PropTypes.object,
  loading: PropTypes.bool,
  defaultDeleteFunction: PropTypes.func,
  createComment: PropTypes.func,
  comments: PropTypes.array,
};

CreateEditComment.defaultProps = {
  mode: 'create',
  display: true,
  toggle: true,
  popup: false,
  loading: false,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditComment));
