import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  FlatButton,
  RaisedButton,
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui';
import { Card, CardMedia, CardActions, CardText } from 'material-ui/Card';
import styled from 'styled-components';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { format } from 'util';
import clubs from 'fxconstants/build/clubsArr.json';
import Amplitude from 'react-amplitude';

import { IconProgress, IconLink, IconImage, IconText } from '../../Icons';
import strings from '../../../lang';
import { bindAll, FormWrapper, TextValidator, bytesToSize } from '../../../utils';
import constants from '../../constants';
import { ajaxGET, createPost as defaultCreateFn, editPost as defaultEditFn, deletePost as defaultDeleteFn, ajaxUpload, announce } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';
import CommunitySelector from './CommunitySelector';

const MAX_SIZE = 1200000;
const MAX_SIZE_MB = 1.2;

const articleContent = {
  lineHeight: '24px',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  color: '#555555',
  fontSize: '14px',
};

const ButtonUpload = styled.button`
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
  background-color: ${constants.theme().surfaceColorPrimary};
  color: rgb(0, 121, 211);
  display: inline-block;
  line-height: 18px;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-radius: 4px;
  text-decoration: none;
  padding: 6px 16px 4px;
  border-color: rgb(0, 121, 211);
  margin: 10px 8px;
`;

class CreateEditPost extends React.Component {
  static defaultFormData = {
    title: '',
    content: '',
    content_type: {
      value: 1,
    },
    communities: {},
    selectedImage: null,
    selectedImageView: null,
    selectedLink: '',
    isValid: false,
    error: [],
    showError: false,
  };

  static initialState = ({
    formData: {
      ...CreateEditPost.defaultFormData,
    },
    wysiwyg: EditorState.createEmpty(),
  });

  constructor(props) {
    super(props);

    this.state = {
      ...CreateEditPost.initialState,
    };
    bindAll([
      'getFormData',
      'submit',
      'deletePost',
      'close',
      'getFormError',
    ], this);
  }

  componentDidMount() {
    Amplitude.logEvent('Enter create post');
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.mode === 'edit' && newProps.post && newProps.id) {
  //     const getType = () => {
  //       const find = newProps.dsPostType.find(o => o.value === Number(newProps.hotspot.type));
  //       return find ? find.text : '';
  //     };
  //
  //     const { post } = newProps;
  //     this.setState({
  //       formData: mergeObject(CreateEditPost.defaultFormData, {
  //         post_id: { value: post.id },
  //         title: post.title,
  //         content: post.content,
  //         content_type: { value: post.type, text: getType() },
  //       }),
  //     });
  //   }
  // }

  getFormError() {
    const { formData } = this.state;
    const err = [];

    if (formData.content_type.value === 2) {
      if (!formData.selectedImage) {
        err.push(strings.err_empty_image);
      } else if (formData.selectedImage.size > MAX_SIZE) {
        err.push(format(strings.err_maximum_fize_size, MAX_SIZE_MB));
      }
    }

    if (!formData.communities.value) {
      err.push(strings.err_empty_community);
    }

    if (!formData.title) {
      err.push(strings.err_empty_title);
    }

    const isValid = err.length === 0;

    this.setState({
      formData: update(this.state.formData, {
        isValid: { $set: isValid },
        error: { $set: err },
      }),
    });
  }

  getFormData() {
    const { formData } = this.state;

    const { content } = formData;

    return {
      title: formData.title,
      content,
      content_type: formData.content_type.value || 1,
      community_id: formData.communities.value.value.id,
    };
  }

  onWysiwygChange = (wysiwyg) => {
    this.setState({
      wysiwyg,
    });
  };

  setFormData = (state, value, callback) => {
    this.setState({
      formData: update(this.state.formData, {
        [state]: { $set: value },
      }),
    }, () => {
      this.getFormError();
      if (callback) callback();
    });
  };

  close() {
    if (this.props.callback) {
      this.props.callback();
    } else {
      this.props.history.push('/');
    }
  }

  updateFormDataContentType(type) {
    this.setState({
      formData: update(this.state.formData, {
        content_type: { value: { $set: type } },
        content: { $set: '' },
      }),
    }, () => {
      this.getFormError();
    });
  }

  previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setFormData('selectedImageView', e.target.result);
    };

    reader.readAsDataURL(file);
  };

  fileChangedHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.setFormData('selectedImage', selectedFile);

      this.previewImage(selectedFile);
    }
  };

  doSubmit = () => {
    const that = this;
    const { mode } = this.props;
    const submitData = this.getFormData();
    /* close form => upload => update formData => submit => notify || catch exception */

    /* close form */
    setTimeout(this.close, 250);
    Amplitude.logEvent('Create post');

    /* declare upload */
    const promiseUpload = new Promise((resolve) => {
      if (this.state.formData.content_type.value === 2) {
        ajaxUpload({
          file: this.state.formData.selectedImage,
        }, (respUpload) => {
          if (respUpload) {
            resolve(respUpload);
          } else {
            resolve(null);
          }
        });
      } else if (this.state.formData.content_type.value === 3) {
        ajaxGET({
          url: 'https://api.linkpreview.net',
          params: {
            key: '5b03a9f4939b356336e5e035f42bac4fe711704c83833',
            q: this.state.formData.selectedLink,
          },
        }, (respGetUrl) => {
          if (respGetUrl) {
            resolve(respGetUrl);
          } else {
            resolve(null);
          }
        });
      } else if (this.state.formData.content_type.value === 1) {
        resolve(draftToMarkdown(convertToRaw(this.state.wysiwyg.getCurrentContent())));
      } else {
        resolve(null);
      }
    });
    //
    /* declare submit */
    const promiseSubmit = params => new Promise((resolve) => {
      if (mode === 'edit') {
        resolve(that.props.defaultEditFunction(that.props.post.id, params));
      } else {
        resolve(that.props.defaultCreateFunction({
          params,
          payload: {
            xuser_avatar: this.props.user.avatar,
            xuser_nickname: this.props.user.nickname,
            xuser_id: this.props.user.id,
          },
        }));
      }
    });

    promiseUpload.then((newContent) => {
      if (newContent) {
        /* announce about post will be created */
        // this.props.announce({
        //   message: strings.announce_creating,
        // });

        promiseSubmit({ ...submitData, content: newContent }).then((respSubmit) => {
          if (respSubmit.type && respSubmit.type.indexOf('OK') !== -1) {
            this.props.announce({
              message: strings.announce_create_post_success,
              action: 'Check it now',
              onActionClick: () => {
                this.props.history.push(`/p/${respSubmit.payload.id}`);
              },
            });
          } else {
            this.props.announce({
              message: strings.announce_create_post_fail,
              action: 'Try again',
              onActionClick: () => {
                this.props.history.push('/submit');
              },
              autoHideDuration: 8000,
            });
          }
        });
      } else {
        this.props.announce({
          message: strings.announce_create_post_fail,
          action: 'Try again',
          onActionClick: () => {
            this.props.history.push('/submit');
          },
        });
      }
    });
  };

  submit(e) {
    e.preventDefault();
    // const data = this.getFormData();
    // console.log('formData', data);

    if (!this.state.formData.error.length) {
      this.doSubmit();
    }
  }

  deletePost() {
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
  }

  renderTitleInput = () => (<TextValidator
    name="title"
    type="text"
    hintText={strings.hint_post_title}
    // floatingLabelText={strings.label_post_title}
    onChange={e => this.setFormData('title', e.target.value)}
    fullWidth
    autoComplete="off"
    underlineShow={false}
    value={this.state.formData.title}
    validators={['required']}
    errorMessages={[strings.err_is_required]}
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
              options: ['bold', 'italic', 'underline'],
            },
          }}
          toolbarStyle={{
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            marginBottom: 0,
          }}
          wrapperStyle={{
            borderTop: `1px solid ${constants.grey200}`,
            borderLeft: `1px solid ${constants.grey200}`,
            borderRight: `1px solid ${constants.grey200}`,
            borderBottom: `1px solid ${constants.grey200}`,
            borderRadius: 4,
            padding: '0 0',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
          editorStyle={{
            padding: '0 20px',
            minHeight: '250px',
            ...articleContent,
          }}
        />
      </div>
    );
  };

  renderContentLinkInput = () => (
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
        name="content"
        type="text"
        hintText={strings.hint_post_content_link}
        onChange={e => this.setFormData('selectedLink', e.target.value)}
        value={this.state.formData.selectedLink}
        hintStyle={{ top: 12 }}
        fullWidth
        validators={['required', 'isLink']}
        errorMessages={[strings.err_is_required, 'Invalid URL']}
        autoComplete="off"
        underlineShow={false}
      />
    </div>
  );

  renderContentImageInput = () => (
    <Card
      style={{
        position: 'relative',
        boxShadow: 'none',
        backgroundColor: 'hsla(0,0%,100%,0)',
        border: `1px solid ${constants.grey200}`,
        borderRadius: 4,
        padding: '0 10px',
        marginBottom: 10,
      }}
    >
      <CardMedia
        style={{
          minHeight: 200,
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            height: '100%',
            verticalAlign: 'middle',
          }}
        >
          <img
            src={this.state.formData.selectedImageView}
            alt=""
            style={{
              verticalAlign: 'middle',
              maxWidth: '100%',
            }}
          />
        </div>
      </CardMedia>
      <CardActions
        style={{
          textAlign: 'center',
          width: 250,
          position: 'absolute',
          top: 'calc(70px)',
          left: 'calc(50% - 125px)',
        }}
      >
        <p style={{ color: 'rgb(0, 121, 211)' }}>
          {/* Drag and drop or */}
          <ButtonUpload onClick={(e) => {
            e.preventDefault();
            this.inputFile.click();
          }}
          >
            {strings.button_upload_image}
          </ButtonUpload>
          <input ref={(el) => { this.inputFile = el; }} type="file" accept="application/java-vm" style={{ display: 'none' }} onChange={this.fileChangedHandler} />
        </p>
      </CardActions>
      {this.state.formData.selectedImage && (
        <CardText>
          <p>Selected image size: {bytesToSize(this.state.formData.selectedImage.size)}</p>
          {this.state.formData.selectedImage.size > MAX_SIZE && <Error text={`Maximum image size: ${MAX_SIZE_MB} MB`} />}
        </CardText>
      )}
    </Card>
  );

  render() {
    const {
      mode,
      display,
      toggle,
      popup,
      loading,
    } = this.props;

    const actionsButtonStyle = {
      height: '32px',
      lineHeight: '32px',
    };
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
      <RaisedButton
        key="cancel"
        label={strings.form_general_cancel}
        onClick={this.close}
        style={{
          margin: 5,
          // boxShadow: 'none',
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 2px, rgba(0, 0, 0, 0.12) 0px 0px 2px',
        }}
        buttonStyle={actionsButtonStyle}
        overlayStyle={{
          height: 32,
        }}
      />,
      <RaisedButton
        key="submit"
        type="submit"
        label={strings.label_post}
        icon={this.props.loading && <IconProgress size={24} />}
        style={{
          margin: 5,
        }}
        buttonStyle={actionsButtonStyle}
        primary
        disabled={!this.state.formData.isValid}
      />,
    ];

    return (
      <div>
        <CommunitySelector
          errorText={this.state.formData.communities.error}
          onSelect={values => this.setFormData('communities', { value: values })}
        />
        <FormWrapper
          data-toggle={toggle}
          data-popup={popup}
          data-display={display}
          onSubmit={this.submit}
        >
          {loading && <Spinner />}
          {/* {this.state.formData.error && <Error errors={this.state.formData.error} />} */}

          <BottomNavigation
            selectedIndex={this.state.formData.content_type.value - 1}
            style={{ justifyContent: 'space-around', marginBottom: '1em' }}
          >
            <BottomNavigationItem
              label="Text"
              icon={<IconText />}
              onClick={() => this.updateFormDataContentType(1)}
            />
            <BottomNavigationItem
              label="Image"
              icon={<IconImage />}
              onClick={() => this.updateFormDataContentType(2)}
            />
            <BottomNavigationItem
              label="Link"
              icon={<IconLink />}
              onClick={() => this.updateFormDataContentType(3)}
            />
          </BottomNavigation>

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
              {this.renderTitleInput()}
            </div>
            <div>
              {this.state.formData.content_type.value === 1 && this.renderRichTextInput()}
              {this.state.formData.content_type.value === 2 && this.renderContentImageInput()}
              {this.state.formData.content_type.value === 3 && this.renderContentLinkInput()}
            </div>
          </div>

          <div className="actions">
            {actions}
          </div>
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
  defaultCreateFunction: ({ params, payload }) => dispatch(defaultCreateFn({ params, payload })),
  defaultEditFunction: (hotspotId, params) => dispatch(defaultEditFn(hotspotId, params)),
  defaultDeleteFunction: hotspotID => dispatch(defaultDeleteFn(hotspotID)),
  announce: props => dispatch(announce(props)),
});

CreateEditPost.propTypes = {
  user: PropTypes.object,

  mode: PropTypes.string,
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  callback: PropTypes.func,

  /**/
  history: PropTypes.object,
  loading: PropTypes.bool,
  defaultDeleteFunction: PropTypes.func,
  announce: PropTypes.func,
};

CreateEditPost.defaultProps = {
  mode: 'create',
  display: true,
  toggle: false,
  popup: false,
  loading: false,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditPost));
