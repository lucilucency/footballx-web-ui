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
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import clubs from '../../../fxconstants/clubsArr.json';
import strings from '../../../lang';
import { bindAll, toPlainText } from '../../../utils';
import { commentInPost } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';
import ui from '../../../theme';

class CreateEditComment extends React.Component {
  static initialState = ({
    formData: {
      content: '',
    },
    // wysiwyg: EditorState.createEmpty(),
    editorState: EditorState.createEmpty(),
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

    // const contentBlock = '';
    // const contentState = ContentState.createFromText(contentBlock);
    // this.setState({
    //   formData: CreateEditComment.initialState.formData,
    //   editorState: EditorState.createWithContent(contentState),
    // });
  }

  close() {
    if (this.props.callback) {
      this.props.callback();
    }
  }

  getFormData = () => ({
    // title: formData.title,
    content: toPlainText(this.state.editorState.getCurrentContent()),
    created_at: parseInt(Date.now() / 1000, 10),
    // content_type: formData.content_type.value || 1,
  });

  addCommentToTree = (newComment) => {
    const pushItUp = (comments) => {
      comments.forEach((el) => {
        el.comments = el.comments || [];
        if (el.id === this.props.target.id) {
          el.comments.push(newComment);
        } else {
          pushItUp(el.comments);
        }
      });
    };
    return pushItUp(this.props.comments);
  };

  resetForm = (cb) => {
    const contentBlock = '';
    const contentState = ContentState.createFromText(contentBlock);
    this.setState({
      formData: CreateEditComment.initialState.formData,
      editorState: EditorState.createWithContent(contentState),
    }, cb);
  };

  submit(e) {
    e.preventDefault();
    const { mode, target } = this.props;
    const submitData = this.getFormData();

    const promiseSubmit = () => new Promise((resolve) => {
      if (mode === 'edit') {
        /* resolve edit function */
      } else {
        let reducer = 'FIRST_ADD/comments';
        let payload = { xuser: this.props.user };
        const reducerCallback = [];
        const payloadCallback = [];
        if (!target.target_id) { /* comment in post */
          reducerCallback.push('EDIT/post');
          payloadCallback.push({
            ...target,
            c_comments: (target.c_comments || 0) + 1,
          });
        }
        if (target.target_id !== target.post_id) {
          /* comment in comment */
          reducer = 'EDIT_TREE/comments';
          // payload = this.addCommentToTree({
          //   ...submitData,
          //   xuser: this.props.user,
          // });
          payload = {
            ...submitData,
            xuser: this.props.user,
          };
          reducerCallback.push('LOCAL_EDIT/post', 'EDIT_ARR/posts');
          payloadCallback.push({
            c_comments: (target.c_comments || 0) + 1,
          }, {
            ...target,
            c_comments: (target.c_comments || 0) + 1,
          });
        }

        resolve(this.props.createComment({
          params: {
            ...submitData,
            target_id: target.id,
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
          this.resetForm(this.close);
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

  onWysiwygChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  renderRichTextInput = () => {
    const suggestions = clubs ? clubs.map(club => ({
      text: club.name,
      value: club.name,
      url: `/t/${club.id}`,
    })) : [];

    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          // rawContentState={this.state.editorState}
          stripPastedStyles
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onWysiwygChange}
          placeholder={strings.hint_post_content}
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
            minHeight: '120px',
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
      loading,
      isCompact,
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
            marginTop: 5,
          }}
          buttonStyle={{
            height: '32px',
            lineHeight: '32px',
          }}
          primary
          onClick={this.submit}
          // disabled={!this.state.formData.content.length}
        />
      ),
    ];

    return (
      <div
        style={{
          backgroundColor: ui.surfaceColorSecondary,
          padding: !isCompact ? '16px 70px' : '16px',
        }}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}

        {this.renderRichTextInput()}

        <div style={{ textAlign: 'right' }}>
          {actions}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  user: state.app.metadata.data.user,
  comments: state.app.comments.data,
  isCompact: state.browser.lessThan.small,
});

const mapDispatchToProps = dispatch => ({
  createComment: args => dispatch(commentInPost(args)),
  defaultEditFunction: () => {},
  defaultDeleteFunction: () => {},
});

CreateEditComment.propTypes = {
  target: PropTypes.object.isRequired,
  mode: PropTypes.string,
  callback: PropTypes.func,
  /**/
  user: PropTypes.object,
  loading: PropTypes.bool,
  defaultDeleteFunction: PropTypes.func,
  createComment: PropTypes.func,
  comments: PropTypes.array,
  isCompact: PropTypes.bool,
};

CreateEditComment.defaultProps = {
  mode: 'create',
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditComment));
