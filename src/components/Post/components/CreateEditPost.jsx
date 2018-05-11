import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  Dialog,
  FlatButton,
  List,
  ListItem,
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui';
import { Card, CardMedia, CardActions } from 'material-ui/Card';
import styled from 'styled-components';

import { IconFail, IconSuccess, IconProgress, IconLink, IconImage, IconText } from '../../Icons';
import strings from '../../../lang';
import { bindAll, mergeObject, FormWrapper, TextValidator } from '../../../utils';
import constants from '../../constants';
import { createPost as defaultCreateFn, editPost as defaultEditFn, deletePost as defaultDeleteFn, ajaxUpload } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';
import CommunitySelector from './CommunitySelector';

class CreateEditPost extends React.Component {
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
      value: 2,
    },
    communities: {},
  };

  static initialState = ({
    type: 'text',
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
      'deletePost',
      'closeDialog',
    ], this);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === 'edit' && newProps.post && newProps.id) {
      const getType = () => {
        const find = newProps.dsPostType.find(o => o.value === Number(newProps.hotspot.type));
        return find ? find.text : '';
      };

      const { post } = newProps;
      this.setState({
        formData: mergeObject(CreateEditPost.defaultFormData, {
          post_id: { value: post.id },
          title: post.title,
          content: post.content,
          content_type: { value: post.type, text: getType() },
        }),
      });
    }
  }

  getFormData() {
    const { formData } = this.state;

    if (!formData.communities.value || !formData.communities.value[0]) {
      this.setState({
        formData: update(this.state.formData, {
          communities: {
            error: { $set: strings.err_is_required },
          },
        }),
      });
      return null;
    }

    return {
      title: formData.title,
      content: formData.content,
      content_type: formData.content_type.value || 1,
      community_id: formData.communities.value[0].value.id,
    };
  }

  submit(e) {
    e.preventDefault();
    const that = this;
    const { mode } = this.props;
    const submitData = this.getFormData();
    if (submitData) {
      this.setState({
        submitResults: update(that.state.submitResults, {
          show: { $set: true },
        }),
      }, () => {
        const doSubmit = new Promise((resolve) => {
          that.setState({
            submitResults: update(that.state.submitResults, {
              data: {
                $push: [{
                  submitAction: mode === 'edit' ? 'Updating post' : 'Creating post',
                  submitting: true,
                }],
              },
            }),
          });

          if (mode === 'edit') {
            resolve(that.props.defaultEditFunction(that.props.post.id, submitData));
          } else {
            resolve(that.props.defaultCreateFunction({
              params: submitData,
              payload: {
                xuser_avatar: this.props.user.avatar,
                xuser_nickname: this.props.user.nickname,
                xuser_id: this.props.user.id,
              },
            }));
          }
        });

        Promise.all([doSubmit]).then((results) => {
          const resultsReport = [];
          if (results[0].type.indexOf('OK') === 0) {
            resultsReport.push({
              submitAction: mode === 'edit' ? 'Update post successfully' : 'Create post successfully',
              submitting: false,
            });
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
  }

  deletePost() {
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

  updateFormDataContentType(type) {
    this.setState({
      formData: update(this.state.formData, {
        content_type: { value: { $set: type } },
        content: { $set: '' },
      }),
    });
  }

  renderTitleInput = () => (<TextValidator
    name="title"
    type="text"
    hintText={strings.hint_post_title}
    floatingLabelText={strings.label_post_title}
    onChange={e => this.setState({
      formData: update(this.state.formData, {
        title: { $set: e.target.value },
      }),
    })}
    fullWidth
    value={this.state.formData.title}
    validators={['required']}
    errorMessages={[strings.err_is_required]}
  />);

  renderContentTextInput = () => (<TextValidator
    name="content"
    type="text"
    hintText={strings.hint_post_content}
    onChange={e => this.updateContent(e.target.value)}
    multiLine
    rows={4}
    rowsMax={10}
    fullWidth
    value={this.state.formData.content && this.state.formData.content}
    hintStyle={{ top: 12 }}
    // validators={['required']}
    // errorMessages={[strings.err_is_required]}
  />);

  updateContent = (text) => {
    this.setState({
      formData: update(this.state.formData, {
        content: { $set: text },
      }),
    }, () => {
      // window.dispatchEvent(new Event('resize'));
    });
  };

  fileChangedHandler = (event) => {
    const that = this;
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      that.updateContent(e.target.result);

      ajaxUpload({
        file: selectedFile,
      }).then((resp) => {
        that.updateContent(resp.text);
      });
    };

    reader.readAsDataURL(selectedFile);
  };

  renderContentImageInput = () => {
    const Button = styled.button`
      box-sizing: border-box;
      cursor: pointer;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 11px;
      background-color: transparent;
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
    return (
      <Card
        style={{
          position: 'relative',
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
              src={this.state.formData.content}
              alt=""
              style={{
                verticalAlign: 'middle',
                // maxHeight: 200,
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
            bottom: 'calc(70px)',
            left: 'calc(50% - 125px)',
          }}
        >
          <p
            style={{
              color: 'rgb(0, 121, 211)',
            }}
          >
            Drag and drop or
            <Button onClick={(e) => {
              e.preventDefault();
                this.inputFile.click();
              }}
            >
              {strings.button_upload_image}
            </Button>
            <input ref={(el) => { this.inputFile = el; }} type="file" style={{ display: 'none' }} onChange={this.fileChangedHandler} />
          </p>
        </CardActions>
      </Card>
    );
  }

  renderContentLinkInput = () => (<TextValidator
    name="content"
    type="text"
    hintText={strings.hint_post_content_link}
    onChange={e => this.updateContent(e.target.value)}
    fullWidth
    value={this.state.formData.content && this.state.formData.content}
    hintStyle={{ top: 12 }}
    validators={['required']}
    errorMessages={[strings.err_is_required]}
  />);

  render() {
    const { props } = this;
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
      <FlatButton
        label={strings.form_general_close}
        key="cancel"
        secondary
        onClick={this.props.callback ? this.props.callback : () => props.history.push('/')}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
        labelPosition="before"
        icon={this.props.loading && <IconProgress size={24} />}
        primary
      />,
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

        <BottomNavigation selectedIndex={this.state.formData.content_type.value - 1}>
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
          <CommunitySelector
            errorText={this.state.formData.communities.error}
            onSelect={(values) => {
              this.setState({
                formData: update(this.state.formData, {
                  communities: {
                    value: { $set: values },
                  },
                }),
              });
            }}
          />
          <div>
            {this.renderTitleInput()}
          </div>
          <div>
            {this.state.formData.content_type.value === 1 && this.renderContentTextInput()}
            {this.state.formData.content_type.value === 2 && this.renderContentImageInput()}
            {this.state.formData.content_type.value === 3 && this.renderContentLinkInput()}
          </div>
        </div>

        <div className="actions">
          {actions}
        </div>

        <Dialog
          title={strings.form_general_dialog_title}
          actions={[<FlatButton
            key="retry"
            label="Retry"
            secondary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
            }}
          />, <FlatButton
            key="done"
            label="Done"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              return this.props.callback ? this.props.callback() : props.history.push('/home');
            }}
          />]}
          modal={false}
          open={this.state.submitResults.show}
          onRequestClose={this.closeDialog}
        >
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              key={r.submitAction}
              primaryText={r.submitAction}
              // eslint-disable-next-line no-nested-ternary
              leftIcon={r.submitting ? <IconProgress size={24} /> :
                r.error ? <IconFail color={constants.colorRed} title={strings.form_general_fail} /> :
                <IconSuccess color={constants.colorSuccess} title={strings.form_general_success} />
              }
              secondaryText={r.error && r.error}
              secondaryTextLines={1}
            />))}
          </List>
        </Dialog>
      </FormWrapper>
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
});

CreateEditPost.propTypes = {
  mode: PropTypes.string,
  display: PropTypes.bool,
  toggle: PropTypes.bool,
  popup: PropTypes.bool,
  callback: PropTypes.func,

  /**/
  loading: PropTypes.bool,
  user: PropTypes.object,
  defaultDeleteFunction: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditPost));
