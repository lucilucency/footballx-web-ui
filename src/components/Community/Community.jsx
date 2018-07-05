import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import IconSort from 'material-ui/svg-icons/content/sort';
import { setCommunity, getCommunity, setTheme, getGroupMemberships, getGroupMembershipPackages, localUpdateMetadata, ajaxGet } from '../../actions';
import { Container, getCookie } from '../../utils/index';
import { TransparentTabBar } from '../TabBar';
import { IconHotFeed } from '../Icons';
import RightComponent from './RightBar';
import Cover from './components/Cover';
import Hot from './FeedHot';
import New from './FeedNew';
import Top from './FeedTop';
import Controversy from './FeedControversy';
import RegisterMembership from './RegisterMembership';
import GroupShortViewRegistration from './components/GroupShortViewRegistration';
import CreatePostHere from './components/CreatePostHere';

const verticalAlign = {
  verticalAlign: 'middle',
};

const getTabs = ({ communityID, loggedInUserID }) => [{
  name: <div><IconHotFeed style={{ ...verticalAlign }} /> <span style={{ ...verticalAlign }}>HOT</span></div>,
  key: 'hot',
  content: <Hot communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/hot`,
}, null && {
  name: 'NEW',
  key: 'new',
  content: <New communityID={communityID} loggedInUserID={loggedInUserID} />,
  route: `/r/${communityID}/new`,
}, {
  name: <div><IconSort style={{ ...verticalAlign }} /> <span style={{ ...verticalAlign }}>TOP</span></div>,
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
    const {
      match,
    } = this.props;
    const communityID = Number(match.params.id);
    const info = match.params.info || 'hot';
    if (!communityID) {
      this.props.history.push('/');
    }
    if (info === 'register' && !getCookie('user_id')) {
      // localStorage.setItem('previousPage', `/r/${communityID}/register`);
      // window.location.href = '/sign_in';

      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/r/${communityID}/register`,
          },
        },
      });
    }

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
            if (respObj) {
              const { membership_process } = respObj;
              if (membership_process) {
                props.localUpdateMetadata({
                  registerMembership: {
                    ...props.registerMembership,
                    ...membership_process,
                  },
                });
              }
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
      match, cData, gmData, loggedInUserID, registerMembership, isCompact,
    } = this.props;
    const communityID = Number(match.params.id);
    const info = match.params.info || 'hot';

    const tabs = getTabs({ communityID, cData, loggedInUserID });
    const tab = tabs.find(_tab => _tab.key === info);

    const templateColumns = tab && tab.disabled ? '1fr' : '1fr 300px';

    return (
      <div>
        <Helmet title={cData.name} />
        {cData.bg ? <Cover isCompact={isCompact} bg={cData.bg} name={cData.name} /> : null}
        {isCompact && !tab.disabled && (
          <div style={{ marginTop: 8 }}>
            <GroupShortViewRegistration
              registerMembership={registerMembership}
              cData={cData}
            />
          </div>
        )}
        <Container
          columns={templateColumns}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            {tab && !tab.disabled && <TransparentTabBar
              info={info}
              tabs={tabs}
            />}
            {gmData && gmData.group_id && <CreatePostHere name={cData.name} />}
            {tab && tab.content}
          </div>
          {!tab.disabled && (
            <RightComponent
              isCompact={this.props.isCompact}
              cData={cData}
              gmData={gmData}
              loggedInUserID={loggedInUserID}
              registerMembership={registerMembership}
            />
          )}
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
  isCompact: PropTypes.bool,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  cData: state.app.community.data,
  gmData: state.app.community.data.groupMemberships,
  registerMembership: state.app.metadata.data.registerMembership,
  loggedInUserID: state.app.metadata.data.user && state.app.metadata.data.user.id,
  theme: state.app.theme,
  isCompact: state.browser.lessThan.small,
});

const mapDispatchToProps = dispatch => ({
  setTheme: props => dispatch(setTheme(props)),
  setCommunity: payload => dispatch(setCommunity(payload)),
  getCommunity: id => dispatch(getCommunity(id)),
  getGroupMemberships: id => dispatch(getGroupMemberships(id)),
  localUpdateMetadata: payload => dispatch(localUpdateMetadata(payload)),
  getGroupMembershipPackages: gmID => dispatch(getGroupMembershipPackages(gmID)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Community));
