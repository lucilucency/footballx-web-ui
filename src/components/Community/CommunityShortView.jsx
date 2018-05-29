import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'material-ui';
import IconCheck from 'material-ui/svg-icons/action/check-circle';
import { followCommunity, unfollowCommunity } from '../../actions';
import { IconFollowCommunity } from '../Icons';

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
    const rightIconStyle = {
      height: '24px',
      width: '24px',
    };

    return (
      <div>
        <h4>{data.name}</h4>
        {this.props.user && <Checkbox
          style={{ margin: 'auto', width: 'auto' }}
          checked={Boolean(this.isFollowing(data.id))}
          checkedIcon={<IconCheck style={rightIconStyle} />}
          uncheckedIcon={<IconFollowCommunity style={{ ...rightIconStyle, fill: 'transparent' }} />}
          onCheck={(e, isChecked) => {
            if (isChecked) {
              this.doSubscribe(data.id);
            } else {
              this.unSubscribe(data.id);
            }
          }}
        />}
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
