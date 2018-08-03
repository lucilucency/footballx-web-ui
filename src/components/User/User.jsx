import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import {
  setCommunity, getCommunity, getCommunityByLink,
  setTheme,
  getGroupMemberships, getGroupMembershipPackages,
  localUpdateMetadata, ajaxGet,
} from '../../actions';
import { getCookie } from '../../utils/index';

const propsLoadData = (props) => {
  const { location } = props;

  if (location.state && location.state.data) {
    props.setCommunity(location.state.data);
  }
  if (props.match.params.id && Number(props.match.params.id)) {
    props.getCommunity(props.match.params.id);
  } else {
    // TODO: get community by link
    props.getCommunityByLink(props.match.params.id);
    // props.history.push('/');
  }
};

const getPackages = (nextProps) => {
  nextProps.getGroupMembershipPackages(nextProps.gmData.id);
};

class UserPage extends React.Component {
  componentDidMount() {
    const {
      match,
    } = this.props;
    const info = match.params.info || 'hot';

    // login before register
    if (info === 'register' && !getCookie('user_id')) {
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/r/${match.params.id}/register`,
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
      cData,
    } = this.props;

    return (
      <div>
        <Helmet title={cData.name} />
      </div>
    );
  }
}

UserPage.propTypes = {
  match: PropTypes.object,
  // location: PropTypes.object,
  cData: PropTypes.object,
  gmData: PropTypes.object,
  theme: PropTypes.object,
  registerMembership: PropTypes.object,
  setTheme: PropTypes.func,
  getGroupMemberships: PropTypes.func,
  localUpdateMetadata: PropTypes.func,
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
  getCommunityByLink: id => dispatch(getCommunityByLink(id)),
  getGroupMemberships: id => dispatch(getGroupMemberships(id)),
  localUpdateMetadata: payload => dispatch(localUpdateMetadata(payload)),
  getGroupMembershipPackages: gmID => dispatch(getGroupMembershipPackages(gmID)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPage));
