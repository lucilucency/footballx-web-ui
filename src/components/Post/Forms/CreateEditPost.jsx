/* eslint-disable react/forbid-prop-types,max-len,no-confusing-arrow,no-restricted-globals */
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
  TextField,
  SelectField,
  MenuItem,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import CircularProgress from 'material-ui/CircularProgress';

import strings from '../../../lang';
import { bindAll, mergeObject, FormWrapper, Row, Col } from '../../../utils';
import constants from '../../constants';
import { createPost as defaultCreateFn, editPost as defaultEditFn, deletePost as defaultDeleteFn } from '../../../actions';
import Error from '../../Error/index';
import Spinner from '../../Spinner/index';

class CreateEditPost extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    /* data source */
    dsPostType: PropTypes.array,
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

  static defaulFormData = {
    title: '',
    content: '',
    content_type: {
      text: strings.enum_post_type_1,
      value: 1,
    },
  };

  static initialState = ({
    formData: {
      ...CreateEditPost.defaulFormData,
    },
    payload: {},
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
      'deleteHotspot',
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
        formData: mergeObject(CreateEditPost.defaulFormData, {
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

    return {
      title: formData.title,
      content: formData.content,
      content_type: formData.content_type.value || 1,
    };
  }

  clearFormData() {
    this.setState(CreateEditPost.initialState);
  }

  submit(e) {
    e.preventDefault();

    const that = this;

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
                submitAction: that.props.mode === 'edit' ? 'Updating hotspot' : 'Creating hotspot',
                submitting: true,
              }],
            },
          }),
        });
        const submitData = this.getFormData();
        if (that.props.mode === 'edit') {
          resolve(editFn(that.props.post.id, submitData));
        } else {
          resolve(createFn(submitData, this.state.payload));
        }
      });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update post successfully' : 'Create post successfully',
            submitting: false,
          });
        } else {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update post failed' : 'Create post failed',
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

  deleteHotspot() {
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
    const { props } = this;
    const {
      mode,
      display,
      toggle,
      popup,
      loading,
    } = this.props;

    const renderTitleInput = () => (<TextField
      key="title"
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
    />);

    const renderContentInput = () => (<TextField
      key="content"
      type="text"
      hintText={strings.hint_post_content}
      // floatingLabelText={strings.label_post_content}
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
      hintStyle={{ top: 12 }}
    />);

    const renderContentTypeSelector = (
      <SelectField
        floatingLabelText={strings.filter_type}
        value={this.state.formData.content_type.value}
        onChange={(event, index, value) => this.setState({
          formData: update(this.state.formData, {
            content_type: { value: { $set: value } },
          }),
        })}
      >
        {this.props.dsPostType.map((o, index) => (
          <MenuItem key={index} value={o.value} primaryText={o.text} />
        ))}
      </SelectField>
    );

    const actions = [
      null && (
        <FlatButton
          type="reset"
          key="reset"
          label="Reset"
          secondary
          onClick={this.clearFormData}
          style={{ float: 'left' }}
        />
      ),
      mode === 'edit' && (
        <FlatButton
          key="delete"
          label={strings.form_general_delete}
          secondary
          onClick={this.deleteHotspot}
          style={{ float: 'left' }}
        />
      ),
      <FlatButton
        label={strings.form_general_close}
        key="cancel"
        primary
        onClick={() => this.props.callback ? this.props.callback() : props.history.push('/home')}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
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

        <div>
          <Row>
            {renderTitleInput()}
          </Row>
          <Row>
            <Col flex={6}>{renderContentInput()}</Col>
          </Row>
          <Row>
            <Col flex={6}>{renderContentTypeSelector}</Col>
          </Row>
        </div>

        <div className="actions">
          {actions}
        </div>

        <Dialog
          title={strings.form_general_dialog_title}
          actions={<FlatButton
            label="Close"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              return this.props.callback && this.props.callback();
                // props.history.push(`/hotspot/${this.state.formData.post_id.value}`);
            }}
          />}
          modal={false}
          open={this.state.submitResults.show}
          onRequestClose={this.closeDialog}
        >
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              key={r.submitAction}
              primaryText={r.submitAction}
              // eslint-disable-next-line no-nested-ternary
              leftIcon={r.submitting ? <CircularProgress size={24} /> :
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

const mapStateToProps = () => ({
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
});

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: params => dispatch(defaultCreateFn(params)),
  defaultEditFunction: (hotspotId, params) => dispatch(defaultEditFn(hotspotId, params)),
  defaultDeleteFunction: hotspotID => dispatch(defaultDeleteFn(hotspotID)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditPost));
