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
import { provincesObj, wardsObj, districtsObj } from '../../../fxconstants';

const patt1 = new RegExp('(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])/([0-9]{4})');
const patt2 = new RegExp('([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])');

const toPickerDate = (date) => {
  if (date && date.length) {
    if (patt1.test(date)) {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
    } else if (patt2.test(date)) {
      return date;
    }
  }

  return '';
};

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
    const { muiTheme, registerMembership, user } = this.props;

    const styles = getStyles(muiTheme);

    return (
      <div style={styles.root}>
        {registerMembership ? (
          <div>
            <div className="font-large" style={{ textTransform: 'uppercase' }}>{strings.announce_registered_membership}</div>
            <Divider style={{ height: '3px', backgroundColor: muiTheme.palette.primary2Color, marginTop: 3 }} />
            <div className="text-little">
              <p>{strings.label_became_membership_code}: <span className="font-normal"><b>{registerMembership.id}</b></span></p>
              {registerMembership.group_membership_pack_data && (
                <p>{strings.label_package}: <b>{registerMembership.group_membership_pack_data.name}</b></p>
              )}
              <div>
                <p>
                  <span>
                    {strings.label_membership_card_info}&nbsp;&nbsp;
                  </span>
                  <a href="" onClick={(e) => { e.preventDefault(); this.props.onRequestEditProfile(); }}>Chỉnh sửa</a>
                </p>
                <ul>
                  <li>{strings.label_name}: {user.fullname}</li>
                  <li>{strings.label_gender}: {strings[`label_gender_${user.gender}`]}</li>
                  <li>Ngày sinh: {toPickerDate(user.birthday)}</li>
                  <li>Email: {user.email}</li>
                </ul>
              </div>
              {registerMembership.xuser_address_data && (
                <div>
                  <p>
                    <span>
                      {strings.label_receiver}: {registerMembership.xuser_address_data.name}&nbsp;&nbsp;
                    </span>
                    <a href="" onClick={(e) => { e.preventDefault(); this.props.onRequestEditReceiver(); }}>Chỉnh sửa</a>
                  </p>
                  <ul>
                    <li>{strings.label_phone}: {registerMembership.xuser_address_data.phone}</li>
                    <li>{strings.label_address}: {registerMembership.xuser_address_data.address}</li>
                    <li>{districtsObj[registerMembership.xuser_address_data.district_id].name}
                    - {wardsObj[registerMembership.xuser_address_data.ward_id].name}
                    - {provincesObj[registerMembership.xuser_address_data.province_id].name}
                    </li>
                  </ul>
                </div>
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
  user: PropTypes.object,
  registerMembership: PropTypes.object,
  onRequestEditReceiver: PropTypes.func,
  onRequestEditProfile: PropTypes.func,
};

const mapStateToProps = state => ({
  gmData: state.app.community.data && state.app.community.data.groupMemberships,
  registerMembership: state.app.metadata.data.registerMembership,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  updateMetadata: payload => dispatch(localUpdateMetadata(payload)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  muiThemeable(),
)(ReviewTransaction);
