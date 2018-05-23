import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import Home from 'material-ui/svg-icons/action/home';
import IconPopular from 'material-ui/svg-icons/action/trending-up';
// import ActionFavorite from 'material-ui/svg-icons/toggle/star';
// import Checkbox from 'material-ui/Checkbox';

import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
// import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import { toggleTray, getSuggestedCommunities, announce } from '../../../actions';
import constants from '../../constants';

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this.props.getSuggestedCommunities();

    // this.props.toggleTray({ state: false });
    if (this.props.location.pathname === '/sign_in' || !this.props.greaterThanSmall) {
      this.props.toggleTray({ state: false });
    } else {
      this.props.toggleTray({ state: true });
    }
  }

  handleToggle() {
    this.props.toggleTray();
  }

  render() {
    const innerDivStyle = {
      marginLeft: 3,
      padding: '1em 1em 1em 3em',
      fontSize: constants.fontSizeSmall,
    };
    const avatarStyle = {
      padding: 1,
      left: 8,
      height: '2em',
      width: '2em',
      fontSize: '1em',
    };
    // const rightIconStyle = {
    //   height: '2em',
    //   width: '2em',
    // };

    const { tray } = this.props;
    const labelStyle = {
      maxWidth: tray.width - 80,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textTransform: 'none !important',
      whiteSpace: 'nowrap',
    };

    return (
      <div>
        <IconButton onClick={this.handleToggle}>
          <MenuIcon />
        </IconButton>
        <Drawer
          docked={this.props.greaterThanSmall}
          width={tray.width}
          open={tray.show}
          onRequestChange={open => !this.props.greaterThanSmall && this.props.toggleTray({ state: open })}
          containerStyle={{
            height: 'calc(100% - 56px)',
            top: 56,
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 2px 2px 5px',
            overflowX: 'hidden',
          }}
          overlayStyle={{
            opacity: 0,
          }}
        >
          <List>
            <Subheader>Feeds</Subheader>
            {this.props.user && <ListItem
              primaryText="Home"
              leftAvatar={<Home style={avatarStyle} color={constants.blueA200} />}
              containerElement={<Link to="/" />}
              innerDivStyle={innerDivStyle}
            />}
            <ListItem
              primaryText="Popular"
              leftAvatar={<IconPopular style={avatarStyle} color={constants.greenA200} />}
              containerElement={<Link to="/popular" />}
              innerDivStyle={innerDivStyle}
            />
          </List>
          {this.props.user && this.props.communities.length ? (
            <List>
              <Subheader>Your communities</Subheader>
              {this.props.communities.map(item => (
                <ListItem
                  key={item.id}
                  primaryText={<div style={labelStyle}>{item.name}</div>}
                  // rightIcon={<Checkbox
                  //   checkedIcon={<ActionFavorite style={rightIconStyle} />}
                  //   uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
                  //   style={{
                  //     marginTop: 4,
                  //   }}
                  // />}
                  leftAvatar={<Avatar style={avatarStyle} src={item.icon} />}
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
        <Snackbar
          open={this.props.announcement.open}
          message={this.props.announcement.message}
          action={this.props.announcement.action}
          autoHideDuration={this.props.announcement.autoHideDuration}
          onActionClick={this.props.announcement.onActionClick}
          onRequestClose={() => {
            this.props.announce({ open: false });
          }}
        />
      </div>
    );
  }
}

BurgerMenu.propTypes = {
  greaterThanSmall: PropTypes.bool,
  location: PropTypes.object,
  communities: PropTypes.array,
  user: PropTypes.object,
  announcement: PropTypes.object,
  tray: PropTypes.object,

  announce: PropTypes.func,
  toggleTray: PropTypes.func,

  history: PropTypes.object,
  getSuggestedCommunities: PropTypes.func,
};

const mapStateToProps = state => ({
  tray: state.app.tray,
  announcement: state.app.announcement,
  communities: state.app.suggestedCommunities.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  toggleTray: props => dispatch(toggleTray(props)),
  announce: props => dispatch(announce(props)),
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BurgerMenu));
