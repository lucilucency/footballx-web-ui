import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import List, { ListItem } from 'material-ui/List';
import Home from 'material-ui/svg-icons/action/home';
import IconPopular from 'material-ui/svg-icons/action/trending-up';

import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import constants from '../constants';

const FeedMenu = ({
  tray, user, history, communities,
}) => {
  const styles = {
    subheader: {
      style: { fontSize: constants.fontSizeTiny },
    },
    listItem: {
      primaryTextStyle: {
        maxWidth: tray.width - 80,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform: 'none !important',
        whiteSpace: 'nowrap',
        fontWeight: constants.fontWeightMedium,
      },
      innerDivStyle: {
        marginLeft: 3,
        paddingLeft: '44px',
        fontSize: constants.fontSizeSmall,
      },
    },
  };

  return (
    <div>
      <List>
        <Subheader style={styles.subheader.style}>FEED</Subheader>
        {user && <ListItem
          primaryText="Home"
          leftIcon={<Home size={24} color={constants.blueA200} />}
          containerElement={<Link to="/" />}
          innerDivStyle={styles.listItem.innerDivStyle}
        />}
        <ListItem
          primaryText="Popular"
          leftIcon={<IconPopular size={24} color={constants.theme().positiveColor} />}
          containerElement={<Link to="/popular" />}
          innerDivStyle={styles.listItem.innerDivStyle}
        />
      </List>
      {user && communities.length ? (
        <List>
          <Subheader style={styles.subheader.style}>YOUR COMMUNITIES</Subheader>
          {communities.map(item => (
            <ListItem
              key={item.id}
              primaryText={<div style={styles.listItem.primaryTextStyle}>{item.name}</div>}
              leftIcon={<Avatar size={24} src={item.icon} />}
              innerDivStyle={styles.listItem.innerDivStyle}
              onClick={() => {
                history.push({
                  pathname: `/r/${item.id}`,
                  state: {
                    data: {
                      id: item.id,
                      icon: item.icon,
                      link: item.link,
                      name: item.name,
                      isFollowing: true,
                    },
                  },
                });
              }}
            />
          ))}
        </List>
      ) : null}
      {user && (
        <List>
          <ListItem
            primaryText="Light off"
            rightToggle={<Toggle
              toggled={localStorage.getItem('theme') === 'dark'}
              onToggle={(e, isInputChecked) => {
                if (isInputChecked) {
                  localStorage.setItem('theme', 'dark');
                } else {
                  localStorage.setItem('theme', 'light');
                }
                window.location.reload();
              }}
            />}
            innerDivStyle={{
              fontSize: constants.fontSizeSmall,
            }}
          />
        </List>
      )}
    </div>
  );
};

FeedMenu.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
  communities: PropTypes.array,
  tray: PropTypes.object,
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  tray: state.app.tray,
  communities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
  user: state.app.metadata.data.user,
});

export default withRouter(connect(mapStateToProps)(FeedMenu));
