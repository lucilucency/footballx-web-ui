import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import Container from 'components/Container';
import styled from 'styled-components';

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
  };

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div><i>*{strings.event_notes}</i></div>
        <OverviewContainer>
          <XUsersContainer>
            <Container
              title={`${strings.heading_xmember}`}
              titleTo="/events"
              loading={false}
              error={false}
            >
              <h1>HEHEHEHEHE</h1>
            </Container>
          </XUsersContainer>
          <HotspotContainer>
            <Container
              title={strings.th_hotspot}
              titleTo="/hotspot"
              loading={false}
              error={false}
            >
              <div>
                <h1>13232</h1>
              </div>
            </Container>
          </HotspotContainer>
        </OverviewContainer>
      </div>
    );
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

