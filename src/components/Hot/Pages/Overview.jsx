import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import strings from 'lang';
/* components */
import Container from 'components/Container';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconPlace from 'material-ui/svg-icons/maps/place';
import IconPhone from 'material-ui/svg-icons/communication/phone';
import IconWifi from 'material-ui/svg-icons/notification/wifi';

/* css */
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const OverviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    @media only screen and (max-width: 1080px) {
      flex-direction: column-reverse;
    }
`;

const XUsersContainer = styled.div`
  width: calc(65% - 15px);
  margin-right: 15px;

  @media only screen and (max-width: 1080px) {
    width: 100%;
    margin-right: 0;
  }
`;

const HotspotContainer = styled.div`
  width: 35%;

  @media only screen and (max-width: 1080px) {
    width: 100%;
  }
`;

class Overview extends React.Component {
  static propTypes = {
    event: PropTypes.shape({}),
    eventXUsers: PropTypes.array,
    user: PropTypes.shape({}),
  };

  componentDidMount() {

  }

  render() {
    const { event, eventXUsers, user } = this.props;
    const eventData = event.data;
    const eventId = eventData.event_id;
    let xusers = eventXUsers;

    xusers = xusers.sort((a, b) => {
      const aDate = new Date(a.event_updated_at);
      const bDate = new Date(b.event_updated_at);

      if (b.event_status === 'checkin') {
        if (a.event_status === 'checkin') {
          return (aDate - bDate);
        }
        return 1;
      }
      return -1;
    });

    return (<div>
      <div><i>*{strings.event_notes}: {eventData.notes}</i></div>
      <OverviewContainer>
        <XUsersContainer>
          <Container
            title={`${strings.heading_xmember} (${eventXUsers.filter(o => o.event_status === 'checkin').length} | ${eventXUsers.length})`}
            titleTo={`/events/${eventId}/xusers`}
            loading={event.loading}
            error={false}
          >
            <h1>HEHEHEHEHE</h1>
          </Container>
        </XUsersContainer>
        <HotspotContainer>
          <Container
            title={strings.th_hotspot}
            titleTo={`/hotspot/${eventData.hotspot_id}`}
            loading={false}
            error={false}
          >
            <div>
              <List>
                <ListItem
                  leftIcon={<IconPlace />}
                  primaryText={eventData.hotspot_name}
                  secondaryText={eventData.hotspot_address}
                />
                {eventData.hotspot_phone && <ListItem
                  insetChildren
                  leftIcon={<IconPhone />}
                  primaryText={eventData.hotspot_phone}
                />}
              </List>
              {eventData.hotspot_wifi && <Divider inset />}
              {eventData.hotspot_wifi && <List>
                <ListItem
                  leftIcon={<IconWifi />}
                  primaryText={eventData.hotspot_wifi}
                  secondaryText={eventData.hotspot_wifi_password}
                />
              </List>}
            </div>
          </Container>
        </HotspotContainer>
      </OverviewContainer>
    </div>);
  }
}

// const mapDispatchToProps = dispatch => ({
// getEventXUsers: (eventId) => dispatch(getEventXUsers(eventId)),
// });

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  event: state.app.event,
});

export default connect(mapStateToProps, null)(Overview);

