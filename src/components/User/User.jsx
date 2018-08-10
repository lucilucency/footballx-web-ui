import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { localSetReducer, getUser, getUserByLink } from '../../actions';
import strings from '../../lang';
import { Container } from '../../utils/index';
import { TransparentTabBar } from '../TabBar';
import Profile from './components/Profile/Profile';
import Posts from './Posts';
import Communities from './Communities';

const propsLoadData = (props) => {
  const { metadata } = props;
  if (props.match.params.id) {
    const identify = props.match.params.id;
    if (identify) {
      if (Number(identify)) {
        if (Number(identify) === metadata.user.id) {
          // set xuser profile by logged in user's profile
          props.localSetXUserMetadata(metadata);
        } else {
          // TODO: get xuser profile by ID
          // props.getUser(props.match.params.id);
        }
      } else if (identify === metadata.user.username) {
        // set xuser profile by logged in user's profile
        props.localSetXUserMetadata(metadata);
      } else {
        // TODO: get xuser profile by user link
        // props.getUserByLink(props.match.params.id);
      }
    } else {
      props.history.push('/');
    }
  }
};

const verticalAlign = {
  verticalAlign: 'middle',
};

const getTabs = ({ userID, userLink, loggedInUserID }) => [{
  name: <div><span style={{ ...verticalAlign }}>{strings.label_posts}</span></div>,
  key: 'posts',
  content: <Posts loggedInUserID={loggedInUserID} />,
  route: `/r/${userID}/posts`,
}, null && {
  name: <div><span style={{ ...verticalAlign }}>{strings.label_community}</span></div>,
  key: 'communities',
  content: <Communities loggedInUserID={loggedInUserID} />,
  route: `/r/${userLink}/communities`,
}].filter(Boolean);

class UserPage extends React.Component {
  componentDidMount() {
    const { location } = this.props;

    if (location.state && location.state.data) {
      this.props.localSetXUserMetadata(location.state.data);
    }
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(props.metadata) !== JSON.stringify(this.props.metadata)) {
      propsLoadData(props);
    }
  }

  render() {
    const { match, xuserMetadata, loggedInUserID } = this.props;
    const userID = Number(match.params.id) || (xuserMetadata.user && xuserMetadata.user.id);
    const userLink = xuserMetadata.user && xuserMetadata.user.username;
    const info = match.params.info || 'posts';

    const tabs = getTabs({ userLink, userID, loggedInUserID });
    const tab = tabs.find(_tab => _tab.key === info);

    const templateColumns = tab && tab.disabled ? '1fr' : '300px 1fr';

    return (
      <div>
        {xuserMetadata && xuserMetadata.user && <Helmet title={xuserMetadata.user.username} />}
        <Container
          columns={templateColumns}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          {!tab.disabled && (
            <Profile
              isCompact={this.props.isCompact}
              loggedInUserID={loggedInUserID}
              userMetadata={xuserMetadata}
            />
          )}
          <div>
            {tab && !tab.disabled && (
              <div>
                <TransparentTabBar
                  info={info}
                  tabs={tabs}
                />
              </div>
            )}
            {tab && tab.content}
          </div>
        </Container>
      </div>
    );
  }
}

UserPage.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  isCompact: PropTypes.bool,
  loggedInUserID: PropTypes.number,
  metadata: PropTypes.object,
  xuserMetadata: PropTypes.object,
  localSetXUserMetadata: PropTypes.func,
};

const mapStateToProps = state => ({
  loggedInUserID: state.app.metadata.data.user && state.app.metadata.data.user.id,
  metadata: state.app.metadata.data,
  xuserMetadata: state.app.xuserMetadata.data,
  isCompact: state.browser.lessThan.small,
});

const mapDispatchToProps = dispatch => ({
  localSetXUserMetadata: payload => dispatch(localSetReducer('xuserMetadata', payload)),
  getUser: id => dispatch(getUser(id)),
  getUserByLink: id => dispatch(getUserByLink(id)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPage));
