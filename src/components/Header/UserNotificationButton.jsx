import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton, ListItem } from 'material-ui';
import { Badge, withStyles } from 'material-ui-next';
import styled from 'styled-components';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { getUserNotificationLogs } from '../../actions';
import Dropdown from '../Header/Dropdown';
import ui from '../../theme';
import { toDateTimeString } from '../../utils';

const styles = () => ({
  badge: {
    top: -8,
    right: -15,
    // border: `1px solid ${ui.alternateTextColor}`,
    backgroundColor: ui.negativeColor,
    color: ui.alternateTextColor,
    fontSize: ui.fontSizeTiny,
    fontWeight: ui.fontWeightHeavy,
    width: 20,
    height: 20,
  },
});

const VerticalAlignDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: center;
  //margin-bottom: 20px;
`;

class UserSettings extends React.Component {
  componentDidMount() {
    this.props.getUserNotificationLogs();
  }

  render() {
    const { classes, notificationLogs } = this.props;
    return (
      <VerticalAlignDropdown
        Button={IconButton}
        buttonProps={{
          children: (
            <Badge
              // badgeContent={4}
              classes={{ badge: classes.badge }}
            >
              <NotificationsIcon color={ui.alternateTextColor} />
            </Badge>
          ),
        }}
      >
        {notificationLogs.map(item => (
          <ListItem
            key={item.id}
            disabled
            primaryText={<div className="font-little" style={{ wordWrap: 'break-all', whiteSpace: 'normal' }}>{item.msg}</div>}
            secondaryText={(
              <div>
                <div className="font-tiny">{toDateTimeString(item.created_at)}</div>
              </div>
            )}
            secondaryTextLines={2}
            style={{ padding: 0, maxWidth: 300 }}
          />
        ))}
      </VerticalAlignDropdown>
    );
  }
}

UserSettings.propTypes = {
  // user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserSettings));
