import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import Home from 'material-ui/svg-icons/action/gavel';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import ActionFavorite from 'material-ui/svg-icons/toggle/star';

import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import { greenA200, redA200, grey50 } from 'material-ui/styles/colors';
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
    const innerDivStyle = {
      marginLeft: 3,
      padding: '1em 1em 1em 3em',
      fontSize: constants.fontSizeMedium,
    };
    const avatarStyle = {
      left: 8,
      height: '2em',
      width: '2em',
      fontSize: '1em',
    };
    const rightIconStyle = {
      height: '2em',
      width: '2em',
      bottom: '0.8em',
    };

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
            <ListItem
              primaryText="Popular"
              leftAvatar={<Home style={avatarStyle} color={constants.blueA200} />}
              containerElement={<Link to="/trending" />}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="Trending"
              leftAvatar={<TrendingUp style={avatarStyle} color={constants.greenA200} />}
              containerElement={<Link to="/hot" />}
              innerDivStyle={innerDivStyle}
            />
          </List>
          <List>
            <Subheader>FAVORITES</Subheader>
            <ListItem
              primaryText="r/Bitcoin"
              leftAvatar={<Avatar color={constants.white} backgroundColor={constants.orangeA200} style={avatarStyle}>฿</Avatar>}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="r/IdleHeroes"
              leftAvatar={<Avatar color={greenA200} backgroundColor={grey50} style={avatarStyle}>I</Avatar>}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="r/ManchesterUnited"
              leftAvatar={<Avatar color={redA200} backgroundColor={grey50} style={avatarStyle} src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/220px-Manchester_United_FC_crest.svg.png" />}
              innerDivStyle={innerDivStyle}
            />
          </List>
          <List>
            <Subheader>SUBSCRIPTIONS</Subheader>
            <ListItem
              primaryText="r/Bitcoin"
              rightIcon={<Checkbox
                checkedIcon={<ActionFavorite style={rightIconStyle} />}
                uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
              />}
              leftAvatar={<Avatar color={constants.white} backgroundColor={constants.orangeA200} style={avatarStyle}>฿</Avatar>}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="r/IdleHeroes"
              rightIcon={<Checkbox
                checkedIcon={<ActionFavorite style={rightIconStyle} />}
                uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
              />}
              leftAvatar={<Avatar color={greenA200} backgroundColor={grey50} style={avatarStyle}>I</Avatar>}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="r/ManchesterUnited"
              rightIcon={<Checkbox
                checkedIcon={<ActionFavorite style={rightIconStyle} />}
                uncheckedIcon={<ActionFavorite style={{ ...rightIconStyle, fill: constants.grey300 }} />}
              />}
              leftAvatar={<Avatar color={redA200} backgroundColor={grey50} style={avatarStyle} src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/220px-Manchester_United_FC_crest.svg.png" />}
              innerDivStyle={innerDivStyle}
            />
          </List>
          <List>
            <Subheader>NOTIFICATIONS</Subheader>
            <ListItem
              primaryText="Events and match"
              rightToggle={<Toggle />}
              innerDivStyle={innerDivStyle}
            />
            <ListItem
              primaryText="Messages"
              rightToggle={<Toggle />}
              innerDivStyle={innerDivStyle}
            />
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
