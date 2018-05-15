import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import { toggleTray, getSuggestedCommunities } from '../../../actions';
import constants from '../../constants';

const StyledDrawer = styled(Drawer)`
  //background-color: ${constants.theme().colorPrimary} !important;
  background-color: white !important;
`;

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
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
        <StyledDrawer
          // docked={false}
          width={tray.width}
          open={tray.show}
          // onRequestChange={open => this.setState({ open })}
          containerStyle={{
            height: 'calc(100% - 56px)',
            top: 56,
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 2px 2px 5px',
            overflowX: 'hidden',
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
                />
              ))}
            </List>
          ) : null}
          {this.props.user && (
            <List>
              <Subheader>Misc</Subheader>
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
        </StyledDrawer>
      </div>
    );
  }
}

BurgerMenu.propTypes = {
  greaterThanSmall: PropTypes.bool,
  toggleTray: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  tray: PropTypes.shape({
    width: PropTypes.number,
  }),
  communities: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  tray: state.app.tray,
  communities: state.app.suggestedCommunities.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  toggleTray: props => dispatch(toggleTray(props)),
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BurgerMenu);
