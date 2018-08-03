import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Avatar, ListItem } from 'material-ui';
import IconCheck from 'material-ui/svg-icons/action/check-circle';
import { followCommunity, unfollowCommunity } from '../../actions';
import { IconFollowCommunity } from '../Icons';
import ui from '../../theme';

class CommunityShortView extends React.Component {
  doSubscribe = (communityID) => {
    this.props.subscribe(this.props.user.id, communityID, {
      following: {
        ...this.props.following,
        communities: [...this.props.following.communities || [], this.props.data],
      },
    });
  };
  unSubscribe = (communityID) => {
    this.props.unsubscribe(this.props.user.id, communityID, {
      following: {
        ...this.props.following,
        communities: this.props.following.communities.filter(el => el.id !== this.props.data.id),
      },
    });
  };
  isFollowing = communityID => this.props.following && this.props.following.communities && this.props.following.communities.find(el => el.id === communityID);

  render() {
    const { data } = this.props;

    return (
      <div>
        <ListItem
          key={data.id}
          disabled
          leftAvatar={<Avatar src={data.icon} />}
          rightIcon={this.props.user && <Checkbox
            checked={Boolean(this.isFollowing(data.id))}
            checkedIcon={<IconCheck />}
            uncheckedIcon={<IconFollowCommunity style={{ fill: 'transparent' }} />}
            onCheck={(e, isChecked) => {
              if (isChecked) {
                this.doSubscribe(data.id);
              } else {
                this.unSubscribe(data.id);
              }
            }}
          />}

          primaryText={data.name}
          secondaryText={data.c_followers &&
          <small style={{ fontSize: ui.fontSizeTiny }}>{`${data.c_followers} followers`}</small>
          }
        />
        <div className="font-little" style={{ padding: '0 16px 16px 16px', whiteSpace: 'pre-wrap' }}>{data.description}</div>
      </div>
    );
  }
}

CommunityShortView.propTypes = {
  data: PropTypes.object,

  /**/
  user: PropTypes.object,
  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
  following: PropTypes.object,
};


const mapStateToProps = state => ({
  loading: state.app.community.loading,
  user: state.app.metadata.data.user,
  following: state.app.metadata.data.following,
});

const mapDispatchToProps = dispatch => ({
  subscribe: (userID, communityID, payload) => dispatch(followCommunity(userID, communityID, payload)),
  unsubscribe: (userID, communityID, payload) => dispatch(unfollowCommunity(userID, communityID, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityShortView);
