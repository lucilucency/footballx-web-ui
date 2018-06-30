import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCommunity, getCommunity, setTheme, getGroupMemberships, getGroupMembershipPackages, localUpdateMetadata, ajaxGet } from '../../actions';
import { Container } from '../../utils/index';
import TabBar from '../TabBar';
import { IconHotFeed } from '../Icons';
import RightComponent from './RightBar';
import Cover from './CommunityCover';
import Hot from './FeedHot';
import New from './FeedNew';
import Top from './FeedTop';
import Controversy from './FeedControversy';
import RegisterMembership from './RegisterMembership';

const verticalAlign = {
  verticalAlign: 'middle',
};

const getTabs = ({ communityID, loggedInUserID }) => [{
  name: <div><IconHotFeed style={{ ...verticalAlign }} /> <b style={{ ...verticalAlign }}>HOT</b></div>,
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
}, {
  name: 'REGISTER MEMBERSHIP',
  key: 'register',
  content: <RegisterMembership communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/register`,
  disabled: true,
  hidden: () => true,
  fullWidth: true,
}].filter(Boolean);

const propsLoadData = (props) => {
  const { location } = props;

  if (location.state && location.state.data) {
    props.setCommunity(location.state.data);
  }
  if (props.match.params.id && Number(props.match.params.id)) {
    props.getCommunity(props.match.params.id);
  } else {
    props.history.push('/');
  }
};

const getPackages = (nextProps) => {
  nextProps.getGroupMembershipPackages(nextProps.gmData.id);
};

class Community extends React.Component {
  componentDidMount() {
    propsLoadData(this.props);
  }

  componentWillReceiveProps(props) {
    const { cData, gmData } = props;

    /** after get community (different local) */
    if (cData && JSON.stringify(cData) !== JSON.stringify(this.props.cData)) {
      // if (location.pathname !== this.props.location.pathname) {
      //   propsLoadData(props);
      // }

      // change theme
      if (cData.color) {
        if (cData.color !== this.props.theme.name) {
          props.setTheme({ name: cData.color });
        }
      }

      /** get group membership */
      if (cData.group_id) {
        props.getGroupMemberships(cData.group_id);
      }

      /** after get group membership */
      if (gmData && JSON.stringify(gmData) !== JSON.stringify(this.props.gmData)) {
        ajaxGet({
          auth: true,
          path: `membership/${props.gmData.id}/process`,
        }, (resp) => {
          try {
            const respObj = JSON.parse(resp);
            const { membership_process } = respObj;
            if (membership_process) {
              props.localUpdateMetadata({
                registerMembership: {
                  ...props.registerMembership,
                  ...membership_process,
                },
              });
            }
          } catch (err) {
            console.error(err);
          }
        });

        getPackages(props);
      }
    }
  }

  render() {
    const {
      match, cData, gmData, loggedInUserID, registerMembership,
    } = this.props;
    const communityID = Number(match.params.id);
    const info = match.params.info || 'hot';

    const tabs = getTabs({ communityID, cData, loggedInUserID });
    const tab = tabs.find(_tab => _tab.key === info);

    const templateColumns = tab && tab.disabled ? '1fr' : '1fr 300px';

    return (
      <div>
        <Helmet title={this.props.cData.name} />
        {cData.bg ? <Cover bg={cData.bg} name={cData.name} /> : null}
        <Container
          columns={templateColumns}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            {tab && !tab.disabled && <TabBar
              info={info}
              tabs={tabs}
            />}
            {tab && tab.content}
          </div>
          {!tab.disabled && <RightComponent cData={cData} gmData={gmData} loggedInUserID={loggedInUserID} registerMembership={registerMembership} />}
        </Container>
      </div>
    );
  }
}

Community.propTypes = {
  match: PropTypes.object,
  // location: PropTypes.object,
  cData: PropTypes.object,
  gmData: PropTypes.object,
  loggedInUserID: PropTypes.number,
  theme: PropTypes.object,
  registerMembership: PropTypes.object,
  setTheme: PropTypes.func,
  getGroupMemberships: PropTypes.func,
  localUpdateMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  cData: state.app.community.data,
  gmData: state.app.community.data.groupMemberships,
  registerMembership: state.app.metadata.data.registerMembership,
  loggedInUserID: state.app.metadata.data.user && state.app.metadata.data.user.id,
  theme: state.app.theme,
});

const mapDispatchToProps = dispatch => ({
  setTheme: props => dispatch(setTheme(props)),
  setCommunity: payload => dispatch(setCommunity(payload)),
  getCommunity: id => dispatch(getCommunity(id)),
  getGroupMemberships: id => dispatch(getGroupMemberships(id)),
  localUpdateMetadata: payload => dispatch(localUpdateMetadata(payload)),
  getGroupMembershipPackages: gmID => dispatch(getGroupMembershipPackages(gmID)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Community);
