/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem, Avatar, Checkbox } from 'material-ui';
import ActionFavorite from 'material-ui/svg-icons/action/touch-app';

import { getSuggestedCommunities } from '../../../actions';
import constants from '../../constants';
// import { SubscribeButton } from '../../Community/components';


class RequestLayer extends React.Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getSuggestedCommunities();
    }
  }

  doSubscribe = () => {
    // console.log('communityID', this.props.communityID);
  };

  unSubscribe = () => {
    // console.log('communityID', this.props.communityID);
  };

  render() {
    const rightIconStyle = {
      height: '2em',
      width: '2em',
    };
    const avatarStyle = {
      left: 8,
      height: '2em',
      width: '2em',
      fontSize: '1em',
    };
    const innerDivStyle = {
      marginLeft: 3,
      padding: '1em 1em 1em 4em',
      fontSize: constants.fontSizeSmall,
    };

    return (
      <List>
        {this.props.communities.map(item => (
          <ListItem
            key={item.id}
            disabled
            primaryText={item.name}
            secondaryText={<small style={{ fontSize: constants.fontSizeSmall }}>{`${item.c_followers} followers`}</small>}
            rightIcon={<Checkbox
              checkedIcon={<ActionFavorite style={rightIconStyle} />}
              uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
              onCheck={(e, isChecked) => {
                if (isChecked) {
                  this.doSubscribe(item.id);
                } else {
                  this.unSubscribe(item.id);
                }
              }}
              style={{
                top: 0,
                width: '3em',
                height: '3em',
              }}
            />}
            leftAvatar={<Avatar color={constants.white} style={avatarStyle} src={item.icon} />}
            innerDivStyle={innerDivStyle}
          />
        ))}
      </List>
    );
  }
}

RequestLayer.propTypes = {
  user: PropTypes.object,
  getSuggestedCommunities: PropTypes.func,
  communities: PropTypes.array,
};

const mapStateToProps = state => ({
  communities: state.app.suggestedCommunities.data,
  loading: state.app.suggestedCommunities.loading,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

// eslint-disable-next-line import/prefer-default-export
export const SuggestedCommunities = connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
