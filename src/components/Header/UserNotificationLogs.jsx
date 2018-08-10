import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui';
import { getUserNotificationLogs } from '../../actions';
import constants from '../constants';
import { toDateTimeString } from '../../utils';

class RequestLayer extends React.Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getUserNotificationLogs();
    }
  }

  render() {
    const { notificationLogs } = this.props;

    return (
      <List style={{ textAlign: 'left' }}>
        {notificationLogs.map(item => (
          <ListItem
            key={item.id}
            disabled
            primaryText={item.msg}
            secondaryText={<div style={{ fontSize: constants.fontSizeLittle }}>{toDateTimeString(item.created_at)}</div>}
          />
        ))}
      </List>
    );
  }
}

RequestLayer.propTypes = {
  user: PropTypes.object,
  getUserNotificationLogs: PropTypes.func,
  notificationLogs: PropTypes.array,
};

const mapStateToProps = state => ({
  notificationLogs: state.app.notificationLogs.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  getUserNotificationLogs: () => dispatch(getUserNotificationLogs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
