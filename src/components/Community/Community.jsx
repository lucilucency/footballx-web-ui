import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCommunity, getCommunity } from '../../actions';
import { Container } from '../../utils/index';
import TabBar from '../TabBar';
import RightComponent from './RightBar';
import Hot from './Hot';
import New from './New';
import Top from './Top';
import Controversy from './Controversy';

const tabs = (communityID, loggedInUserID) => [{
  name: 'HOT HOT HOT',
  key: 'hot',
  content: <Hot communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/hot`,
}, null && {
  name: 'NEW',
  key: 'new',
  content: <New communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/new`,
}, {
  name: 'TOP',
  key: 'top',
  content: <Top communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/top`,
}, null && {
  name: 'CONTROVERSY',
  key: 'controversy',
  content: <Controversy communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/controversy`,
}].filter(Boolean);

const propsLoadData = (props) => {
  const { location } = props;

  if (location.state && location.state.data) {
    props.setCommunity(location.state.data);
  } else if (props.match.params.id && Number(props.match.params.id)) {
    props.getCommunity(props.match.params.id);
  } else {
    props.history.push('/');
  }
};

class CommunityHot extends React.Component {
  componentDidMount() {
    propsLoadData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname) {
      propsLoadData(props);
    }
  }

  render() {
    const { match, data, loggedInUserID } = this.props;
    const matchID = Number(match.params.id);
    const info = match.params.info || 'hot';
    const tab = tabs(matchID, loggedInUserID).find(_tab => _tab.key === info);

    // if (!matchID || !tab) {
    //   this.props.history.push('/');
    // }

    return (
      <div>
        <Helmet title={this.props.data.name} />
        <Container
          columns="1fr 300px"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <TabBar
              info={info}
              tabs={tabs(matchID, loggedInUserID)}
            />
            {tab && tab.content}
          </div>
          <RightComponent data={data} />
        </Container>
      </div>
    );
  }
}

CommunityHot.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,

  data: PropTypes.object,
  loggedInUserID: PropTypes.number,
};

const mapStateToProps = state => ({
  data: state.app.community.data,
  loggedInUserID: state.app.metadata.data.user && state.app.metadata.data.user.id && Number(state.app.metadata.data.user.id),
});

const mapDispatchToProps = dispatch => ({
  setCommunity: payload => dispatch(setCommunity(payload)),
  getCommunity: id => dispatch(getCommunity(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(CommunityHot);
