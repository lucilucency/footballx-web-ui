import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Prompt, withRouter } from 'react-router-dom';
import { muiThemeable } from 'material-ui/styles';
import RaisedButton from 'material-ui/RaisedButton';
import { localUpdateMetadata, announce, refresh } from '../../../actions';
// import strings from '../../../lang';
import { UpdateUserInfo } from '../../User/components';

class UpdateUserInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isFirst: true,
      isFormValid: false,
      toppingUp: 0,
    };
  }

  componentDidMount() {

  }

  checkAfterSubmit = (key, isValid) => {
    this.props.callback(isValid);
  };

  render() {
    const { isCompact } = this.props;

    return (
      <div style={{ minHeight: isCompact ? 400 : 600 }}>
        <div>
          <div>
            <div>
              <UpdateUserInfo
                setTrigger={(action) => {
                  this.triggerSubmit = action;
                  this.forceUpdate();
                }}
                onError={(err) => {
                  if (err.length) {
                    this.setState({ isFormValid: false });
                  } else {
                    this.setState({ isFormValid: true });
                  }
                }}
                onSubmit={isValid => this.checkAfterSubmit('complete_profile', isValid)}
              />
            </div>
            <div style={{ marginTop: '1em', marginBottom: '1em', textAlign: 'center' }}>
              <RaisedButton
                label="Submit"
                disabled={!this.state.isFormValid}
                primary
                style={{ width: 200 }}
                onClick={this.triggerSubmit}
              />
            </div>
          </div>
        </div>
        <Prompt message="Thay đổi chưa được lưu lại. Bạn vẫn tiếp tục muốn thoát?" when={this.state.toppingUp === 1} />
      </div>
    );
  }
}

UpdateUserInfoForm.propTypes = {
  // muiTheme: PropTypes.object,
  isCompact: PropTypes.bool,
  callback: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  isCompact: state.browser.lessThan.small,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
  announceFn: props => dispatch(announce(props)),
  refresh: () => dispatch(refresh()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  muiThemeable(),
)(UpdateUserInfoForm);
