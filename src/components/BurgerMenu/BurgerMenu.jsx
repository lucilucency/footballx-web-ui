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

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    // this.props.setTray({ state: false });
    if (notNeedMe.indexOf(this.props.location.pathname) !== -1 || !this.props.greaterThanSmall) {
      this.props.setTray({ state: false });
    } else {
      this.props.setTray({ state: true });
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname || props.greaterThanSmall !== this.props.greaterThanSmall) {
      if (!props.greaterThanSmall) {
        this.props.setTray({ state: false });
      } else if (notNeedMe.indexOf(props.location.pathname) !== -1) {
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
    const innerDivStyle = {
      marginLeft: 3,
      paddingLeft: '44px',
      fontSize: constants.fontSizeSmall,
    };

    const { tray } = this.props;
    const labelStyle = {
      maxWidth: tray.width - 80,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textTransform: 'none !important',
      whiteSpace: 'nowrap',
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
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 2px 2px 5px',
          overflowX: 'hidden',
          zIndex: 1,
        }}
        overlayStyle={{
          opacity: 0,
        }}
      >
        <List>
          <Subheader>FEED</Subheader>
          {this.props.user && <ListItem
            primaryText="Home"
            leftIcon={<Home size={24} color={constants.blueA200} />}
            containerElement={<Link to="/" />}
            innerDivStyle={innerDivStyle}
          />}
          <ListItem
            primaryText="Popular"
            leftIcon={<IconPopular size={24} color={constants.greenA200} />}
            containerElement={<Link to="/popular" />}
            innerDivStyle={innerDivStyle}
          />
          {/* <ListItem */}
          {/* primaryText="Match" */}
          {/* leftIcon={<IconPopular size={24} color={constants.redA200} />} */}
          {/* containerElement={<Link to="/match" />} */}
          {/* innerDivStyle={innerDivStyle} */}
          {/* /> */}
        </List>
        {this.props.user && this.props.communities.length ? (
          <List>
            <Subheader>YOUR COMMUNITIES</Subheader>
            {this.props.communities.map(item => (
              <ListItem
                key={item.id}
                primaryText={<div style={labelStyle}>{item.name}</div>}
                leftIcon={<Avatar size={24} src={item.icon} />}
                innerDivStyle={innerDivStyle}
                onClick={() => {
                  this.props.history.push(`/r/${item.id}`);
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
