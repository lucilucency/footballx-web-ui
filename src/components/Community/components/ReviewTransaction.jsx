import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
// import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { Divider } from 'material-ui';
import { muiThemeable } from 'material-ui/styles';
import strings from '../../../lang';
import constants from '../../constants';
import { getCookie } from '../../../utils/index';
import { localUpdateMetadata, ajaxGet } from '../../../actions';

const getStyles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: theme.paper.backgroundColor,
    padding: theme.spacing.desktopGutter,
    fontSize: constants.fontSizeLittle,
    maxWidth: 600,
    margin: 'auto',
  },
});

const getDataPackages = props => new Promise((resolve) => {
  ajaxGet({
    auth: true,
    path: `membership/${props.gmData.id}/packs`,
  }, (resp) => {
    try {
      const respObj = JSON.parse(resp);
      const { group_membership_packs } = respObj;
      if (group_membership_packs && group_membership_packs.length) {
        const pack = group_membership_packs.find(el => el.id === props.registerMembership.group_membership_pack_id);
        resolve(pack);
      } else {
        resolve(null);
      }
    } catch (err) {
      console.error(err);
      resolve(null);
    }
  });
});

const getDataReceiverAddress = () => new Promise((resolve) => {
  ajaxGet({
    auth: true,
    path: `xuser/${getCookie('user_id')}/addresses`,
  }, (resp) => {
    try {
      const respObj = JSON.parse(resp);
      const { xuser_addresses } = respObj;
      if (xuser_addresses && xuser_addresses.length) {
        const userAddress = xuser_addresses[xuser_addresses.length - 1];
        resolve(userAddress);
      } else {
        resolve(null);
      }
    } catch (err) {
      console.error(err);
      resolve(null);
    }
  });
});

const getData = (props) => {
  const promiseProcesses = [];
  if (!props.registerMembership.group_membership_pack_data && !props.registerMembership.xuser_address_data) {
    promiseProcesses.push(getDataPackages(props));
    promiseProcesses.push(getDataReceiverAddress(props));

    Promise.all(promiseProcesses).then((promiseResp) => {
      props.updateMetadata({
        registerMembership: {
          ...props.registerMembership,
          group_membership_pack_data: promiseResp[0],
          xuser_address_data: promiseResp[1],
        },
      });
    });
  }
};

class ReviewTransaction extends Component {
  componentDidMount() {
    if (this.props.gmData && this.props.gmData.id && this.props.registerMembership) {
      getData(this.props);
    }
  }

  componentWillReceiveProps(props) {
    if (!this.props.gmData && props.gmData && props.gmData.id) {
      getData(props);
    }
  }

  render() {
    const { muiTheme, registerMembership } = this.props;

    const styles = getStyles(muiTheme);

    return (
      <div style={styles.root}>
        {registerMembership ? (
          <div>
            <div className="font-large" style={{ textTransform: 'uppercase' }}>{strings.announce_registered_membership}</div>
            <Divider style={{ height: '3px', backgroundColor: muiTheme.palette.primary2Color, marginTop: 3 }} />
            <div className="text-little">
              <p>Transaction Code: {registerMembership.id}</p>
              {registerMembership.group_membership_pack_data && (
                <p>{strings.label_package}: <b>{registerMembership.group_membership_pack_data.name}</b></p>
              )}
              {registerMembership.xuser_address_data && (
                <p>{strings.label_receiver}: {registerMembership.xuser_address_data.name}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1>Vui lòng hoàn thành các bước trước</h1>
          </div>
        )}
      </div>
    );
  }
}

ReviewTransaction.propTypes = {
  /**/
  muiTheme: PropTypes.object,
  gmData: PropTypes.object,
  registerMembership: PropTypes.object,
  // updateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  gmData: state.app.community.data && state.app.community.data.groupMemberships,
  registerMembership: state.app.metadata.data.registerMembership,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(ReviewTransaction);
