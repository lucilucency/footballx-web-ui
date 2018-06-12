import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem, Avatar, Checkbox } from 'material-ui';
import IconCheck from 'material-ui/svg-icons/action/check-circle';

import { getSuggestedCommunities, followCommunity, unfollowCommunity } from '../../../actions';
import constants from '../../constants';
import { IconFollowCommunity } from '../../Icons';


class RequestLayer extends React.Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getSuggestedCommunities();
    }
  }

  doSubscribe = (community) => {
    const { communities = [] } = this.props.following;
    this.props.subscribe(this.props.user.id, community.id, {
      following: {
        ...this.props.following,
        communities: [...communities, community],
      },
    });
  };

  unSubscribe = (community) => {
    this.props.unsubscribe(this.props.user.id, community.id, {
      following: {
        ...this.props.following,
        communities: this.props.following.communities.filter(el => el.id !== community.id),
      },
    });
  };

  isFollowing = communityID => this.props.following && this.props.following.communities && this.props.following.communities.find(el => el.id === communityID);

  render() {
    let { suggestedCommunities } = this.props;
    suggestedCommunities = suggestedCommunities.filter(el => !this.isFollowing(el.id)).slice(0, 5);

    const rightIconStyle = {
      height: '24px',
      width: '24px',
    };

    return (
      <List style={{ textAlign: 'left' }}>
        {suggestedCommunities.map(item => (
          <ListItem
            key={item.id}
            disabled
            leftIcon={<Avatar src={item.icon} size={24} />}
            rightIcon={<Checkbox
              checkedIcon={<IconCheck style={rightIconStyle} />}
              uncheckedIcon={<IconFollowCommunity style={{ ...rightIconStyle, fill: 'transparent' }} />}
              onCheck={(e, isChecked) => {
                if (isChecked) {
                  this.doSubscribe(item);
                } else {
                  this.unSubscribe(item);
                }
              }}
            />}

            primaryText={item.name}
            secondaryText={item.c_followers &&
              <small style={{ fontSize: constants.fontSizeSmall }}>{`${item.c_followers} followers`}</small>
            }
          />
        ))}
      </List>
    );
  }
}

RequestLayer.propTypes = {
  user: PropTypes.object,
  getSuggestedCommunities: PropTypes.func,
  suggestedCommunities: PropTypes.array,

  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
  following: PropTypes.object,
};

const mapStateToProps = state => ({
  suggestedCommunities: state.app.suggestedCommunities.data,
  loading: state.app.suggestedCommunities.loading,
  user: state.app.metadata.data.user,
  following: state.app.metadata.data.following,
});

const mapDispatchToProps = dispatch => ({
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
  subscribe: (userID, communityID, payload) => dispatch(followCommunity(userID, communityID, payload)),
  unsubscribe: (userID, communityID, payload) => dispatch(unfollowCommunity(userID, communityID, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
