/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'material-ui';
import ActionFavorite from 'material-ui/svg-icons/action/touch-app';
import { followCommunity, unfollowCommunity } from '../../../actions';
import constants from '../../constants';

class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubscribed: props.isSubscribed,
    };
  }

  doSubscribe = () => {
    this.setState({
      isSubscribed: true,
    });
    // console.log('communityID', this.props.communityID);
  };

  unSubscribe = () => {
    this.setState({
      isSubscribed: false,
    });
    // console.log('communityID', this.props.communityID);
  };

  render() {
    const rightIconStyle = {
      height: '2em',
      width: '2em',
      marginTop: 0,
    };

    return (
      <Checkbox
        checkedIcon={<ActionFavorite style={rightIconStyle} />}
        uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
        onCheck={(e, isChecked) => {
          if (isChecked) {
            this.doSubscribe();
          } else {
            this.unSubscribe();
          }
        }}
        disabled={this.state.isSubscribed}
      />
    );
  }
}

SubscribeButton.propTypes = {
  isSubscribed: PropTypes.bool,
  // communityID: PropTypes.number,

  // subscribe: PropTypes.func,
  // unsubscribe: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  subscribe: (userID, communityID) => dispatch(followCommunity(userID, communityID)),
  unsubscribe: (userID, communityID) => dispatch(unfollowCommunity(userID, communityID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeButton);
