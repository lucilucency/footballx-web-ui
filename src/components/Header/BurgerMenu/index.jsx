import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import { pinkA200, greenA200, redA200, grey50 } from 'material-ui/styles/colors';
import constants from '../../constants';

const StyledDrawer = styled(Drawer)`
  //background-color: ${constants.theme().colorPrimary} !important;
  background-color: white !important;
`;

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: Boolean(props.greaterThanSmall) };
    this.handleToggle = () => this.setState({ open: !this.state.open });

    // this.callbackClickItem = this.callbackClickItem.bind(this);
  }

  render() {
    return (
      <div>
        <IconButton onClick={this.handleToggle}>
          <MenuIcon />
        </IconButton>
        <StyledDrawer
          // docked={false}
          width={260}
          open={this.state.open}
          // onRequestChange={open => this.setState({ open })}
          containerStyle={{
            height: 'calc(100% - 56px)',
            top: 56,
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 2px 2px 5px',
            overflowX: 'hidden',
          }}
        >
          <List>
            <Subheader>FEEDS</Subheader>
            <ListItem primaryText="Home" leftIcon={<ContentSend />} containerElement={<Link to="/home" />} />
            <ListItem primaryText="Popular" leftIcon={<ContentDrafts />} containerElement={<Link to="/popular" />} />
            <ListItem primaryText="All" leftIcon={<ContentDrafts />} containerElement={<Link to="/all" />} />
          </List>
          <List>
            <Subheader>FAVORITES</Subheader>
            <ListItem
              primaryText="r/Bitcoin"
              leftAvatar={<Avatar color={pinkA200} backgroundColor={grey50} style={{ left: 8 }}>B</Avatar>}
            />
            <ListItem
              primaryText="r/IdleHeroes"
              leftAvatar={<Avatar color={greenA200} backgroundColor={grey50} style={{ left: 8 }}>I</Avatar>}
            />
            <ListItem
              primaryText="r/ManchesterUnited"
              leftAvatar={<Avatar color={redA200} backgroundColor={grey50} style={{ left: 8 }}>MU</Avatar>}
            />
          </List>
          <List>
            <Subheader>SUBSCRIPTIONS</Subheader>
            <ListItem
              primaryText="r/Bitcoin"
              rightIcon={<Checkbox />}
              leftAvatar={<Avatar color={pinkA200} backgroundColor={grey50} style={{ left: 8 }}>B</Avatar>}
            />
            <ListItem
              primaryText="r/IdleHeroes"
              rightIcon={<Checkbox />}
              leftAvatar={<Avatar color={greenA200} backgroundColor={grey50} style={{ left: 8 }}>I</Avatar>}
            />
            <ListItem
              primaryText="r/ManchesterUnited"
              rightIcon={<Checkbox />}
              leftAvatar={<Avatar color={redA200} backgroundColor={grey50} style={{ left: 8 }}>MU</Avatar>}
            />
          </List>
          <List>
            <Subheader>NOTIFICATIONS</Subheader>
            <ListItem primaryText="Events and match" rightToggle={<Toggle />} />
            <ListItem primaryText="Messages" rightToggle={<Toggle />} />
          </List>
        </StyledDrawer>
      </div>
    );
  }
}

BurgerMenu.propTypes = {
  greaterThanSmall: PropTypes.bool,
};

export default connect(null, null)(BurgerMenu);
