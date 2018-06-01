import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import List, { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { IconHot } from '../Icons';
import constants from '../constants';
import strings from '../../lang';

const leagues = require('../../fxconstants/leaguesArr.json');

const FeedMenu = ({
  tray, history,
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
        <ListItem
          primaryText={strings.label_hot_matches}
          leftIcon={<IconHot size={18} />}
          containerElement={<Link to="/match/hot" />}
          innerDivStyle={styles.listItem.innerDivStyle}
        />
      </List>
      {leagues && leagues.length ? (
        <List>
          <Subheader style={styles.subheader.style}>HOT LEAGUES</Subheader>
          {leagues.map(item => (
            <ListItem
              key={item.id}
              primaryText={<div style={styles.listItem.primaryTextStyle}>{item.name}</div>}
              leftIcon={<Avatar size={24} src={item.icon} />}
              innerDivStyle={styles.listItem.innerDivStyle}
              onClick={() => {
                history.push({
                  pathname: `/l/${item.id}`,
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
  // user: PropTypes.object,
  tray: PropTypes.object,
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  tray: state.app.tray,
  communities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
  user: state.app.metadata.data.user,
});

export default withRouter(connect(mapStateToProps)(FeedMenu));
