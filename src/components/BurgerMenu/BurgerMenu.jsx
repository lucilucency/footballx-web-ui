import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import Home from 'material-ui/svg-icons/action/home';
import IconPopular from 'material-ui/svg-icons/action/trending-up';

import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { setTray, getSuggestedCommunities } from '../../actions/index';
import constants from '../constants';

const notNeedMe = ['/sign_in', '/match'];

function doYouNeedMe(text) {
  if (notNeedMe.indexOf(text) !== -1) {
    return false;
  }
  if (text.indexOf('/m/') === -1) {
    return false;
  }
  return true;
}

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    // this.props.setTray({ state: false });
    if (doYouNeedMe(this.props.location.pathname) || !this.props.greaterThanSmall) {
      this.props.setTray({ state: false });
    } else {
      this.props.setTray({ state: true });
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname || props.greaterThanSmall !== this.props.greaterThanSmall) {
      if (!props.greaterThanSmall) {
        this.props.setTray({ state: false });
      } else if (doYouNeedMe(props.location.pathname)) {
        this.props.setTray({ state: false });
      } else {
        this.props.setTray({ state: true });
      }
    }
  }

  handleToggle() {
    this.props.setTray();
  }

  render() {
    const { tray } = this.props;

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
      <Drawer
        docked={this.props.greaterThanSmall}
        width={tray.width}
        open={tray.show}
        onRequestChange={open => !this.props.greaterThanSmall && this.props.setTray({ state: open })}
        containerStyle={{
          height: 'calc(100vh - 56px)',
          top: 56,
          // boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 2px 2px 5px',
          boxShadow: 'none',
          overflowX: 'hidden',
          zIndex: 1300,
        }}
        overlayStyle={{
          opacity: 0,
        }}
      >
        <List>
          <Subheader style={styles.subheader.style}>FEED</Subheader>
          {this.props.user && <ListItem
            primaryText="Home"
            leftIcon={<Home size={24} color={constants.blueA200} />}
            containerElement={<Link to="/" />}
            innerDivStyle={styles.listItem.innerDivStyle}
          />}
          <ListItem
            primaryText="Popular"
            leftIcon={<IconPopular size={24} color={constants.greenA200} />}
            containerElement={<Link to="/popular" />}
            innerDivStyle={styles.listItem.innerDivStyle}
          />
        </List>
        {this.props.user && this.props.communities.length ? (
          <List>
            <Subheader style={styles.subheader.style}>YOUR COMMUNITIES</Subheader>
            {this.props.communities.map(item => (
              <ListItem
                key={item.id}
                primaryText={<div style={styles.listItem.primaryTextStyle}>{item.name}</div>}
                leftIcon={<Avatar size={24} src={item.icon} />}
                innerDivStyle={styles.listItem.innerDivStyle}
                onClick={() => {
                  this.props.history.push({
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
        {this.props.user && (
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
      </Drawer>
    );
  }
}

BurgerMenu.propTypes = {
  greaterThanSmall: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  communities: PropTypes.array,
  tray: PropTypes.object,
  setTray: PropTypes.func,
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  tray: state.app.tray,
  communities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  setTray: props => dispatch(setTray(props)),
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BurgerMenu));
