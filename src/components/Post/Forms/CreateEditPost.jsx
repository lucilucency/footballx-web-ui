/* eslint-disable react/forbid-prop-types,max-len,no-confusing-arrow,no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import {
  AutoComplete,
  Dialog,
  FlatButton,
  List,
  ListItem,
  TextField,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import CircularProgress from 'material-ui/CircularProgress';

import strings from '../../../lang';
import { bindAll, FormWrapper, Row, Col } from '../../../utils';
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
    dsHotspotType: PropTypes.array,
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

  static initialState = ({
    formData: {
      name: {},
      short_name: {},
      type: {},
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
    if (newProps.mode === 'edit') {
      const type = () => {
        const find = newProps.dsHotspotType.find(o => o.value === Number(newProps.hotspot.type));
        return find && find.text;
      };

      const data = newProps.post;

      this.setState({
        formData: {
          post_id: { value: data.id },
          name: { value: data.name, text: data.name && data.name.toString() },
          short_name: { value: data.short_name, text: data.short_name && data.short_name.toString() },
          type: { value: data.type, text: type() },
        },
      });
    }
  }

  getFormData() {
    const { formData } = this.state;

    return {
      name: formData.name.value,
      short_name: formData.short_name.value,
      type: formData.type.value || 1,
    };
  }

  clearState() {
    this.setState(CreateEditPost.initialState);
  }

  submit() {
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
          resolve(editFn(that.props.hotspot.id, submitData));
        } else {
          resolve(createFn(submitData, this.state.payload));
        }
      });

      // var p1 = Promise.resolve(3);
      // var p2 = 1337;
      // const p3 = new Promise((resolve, reject) => {
      //   setTimeout(resolve, 10000, 'foo');
      // });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update hotspot successfully' : 'Create hotspot successfully',
            submitting: false,
          });

          that.setState({
            formData: update(that.state.formData, {
              post_id: {
                $set: {
                  value: results[0].payload.id,
                },
              },
            }),
          });
        } else {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update hotspot failed' : 'Create hotspot failed',
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
    if (confirm('Are you sure you want to delete this hotspot?')) {
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
              submitAction: 'Delete hotspot successfully',
              submitting: false,
            });
          } else {
            resultsReport.push({
              submitAction: 'Delete hotspot failed',
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

    const renderHotspotName = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_name}
      floatingLabelText={strings.tooltip_hotspot_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          name: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.name && this.state.formData.name.value}
    />);

    const renderHotspotShortName = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_short_name}
      floatingLabelText={strings.tooltip_hotspot_short_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          short_name: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.short_name && this.state.formData.short_name.value}
    />);

    const renderHotspotType = () => (<AutoComplete
      name="type"
      hintText={strings.filter_hotspot_type}
      floatingLabelText={strings.filter_hotspot_type}
      searchText={this.state.formData.type.text}
      value={this.state.formData.type.value}
      dataSource={this.props.dsHotspotType}
      onNewRequest={(o) => {
        this.setState({
          formData: update(this.state.formData, {
            type: { $set: o },
          }),
        });
      }}
      onUpdateInput={(searchText) => {
        this.setState({
          formData: update(this.state.formData, {
            type: { $set: { value: searchText } },
          }),
        });
      }}
      filter={AutoComplete.caseInsensitiveFilter}
      openOnFocus
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);

    const actions = [
      null && (
        <FlatButton
          type="reset"
          key="reset"
          label="Reset"
          secondary
          onClick={this.clearState}
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
        onClick={() => this.props.callback ? this.props.callback() : props.history.push('/hotspots')}
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
            {renderHotspotName()}
          </Row>
          <Row>
            <Col flex={6}>{renderHotspotShortName()}</Col>
          </Row>
          <Row>
            <Col flex={6}>{renderHotspotType()}</Col>
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
              return this.props.callback ? this.props.callback() : props.history.push(`/hotspot/${this.state.formData.post_id.value}`);
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
              leftIcon={() => {
                if (r.submitting) {
                  return (<CircularProgress size={24} />);
                } else if (r.error) {
                  return (<IconFail color={constants.colorRed} title={strings.form_general_fail} />);
                }
                return (<IconSuccess color={constants.colorSuccess} title={strings.form_general_success} />);
              }}
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
  dsHotspotType: [{
    text: strings.enum_hotspot_type_1,
    value: 1,
  }, {
    text: strings.enum_hotspot_type_2,
    value: 2,
  }, {
    text: strings.enum_hotspot_type_3,
    value: 3,
  }],
});

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: params => dispatch(defaultCreateFn(params)),
  defaultEditFunction: (hotspotId, params) => dispatch(defaultEditFn(hotspotId, params)),
  defaultDeleteFunction: hotspotID => dispatch(defaultDeleteFn(hotspotID)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditPost));
