import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import List, { ListItem } from 'material-ui/List';
import IconPopular from 'material-ui/svg-icons/action/trending-up';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ui from '../../theme';
import strings from '../../lang';

const FeedMenu = ({
  tray, user, history, communities,
}) => {
  const styles = {
    subheader: {
      style: { fontSize: ui.fontSizeTiny },
    },
    listItem: {
      primaryTextStyle: {
        maxWidth: tray.width - 80,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform: 'none !important',
        whiteSpace: 'nowrap',
        fontWeight: ui.fontWeightMedium,
      },
      innerDivStyle: {
        marginLeft: 3,
        paddingLeft: '44px',
        fontSize: ui.fontSizeSmall,
      },
    },
  };

  return (
    <div>
      <List>
        <ListItem
          primaryText={strings.menu_popular}
          leftIcon={<IconPopular size={24} color={ui.positive1Color} />}
          containerElement={<Link to="/popular" />}
          innerDivStyle={styles.listItem.innerDivStyle}
        />
      </List>
      {user && communities.length ? (
        <List>
          <Subheader style={styles.subheader.style}>{strings.menu_your_communities.toUpperCase()}</Subheader>
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
