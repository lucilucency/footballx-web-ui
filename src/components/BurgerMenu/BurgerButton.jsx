import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import { toggleTray } from '../../actions/index';

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.props.toggleTray();
  }

  render() {
    return (
      <IconButton onClick={this.handleToggle}>
        <MenuIcon />
      </IconButton>
    );
  }
}

BurgerMenu.propTypes = {
  toggleTray: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleTray: props => dispatch(toggleTray(props)),
});

export default connect(null, mapDispatchToProps)(BurgerMenu);
