import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
// import MenuIcon from 'material-ui/svg-icons/navigation/menu';
// import { Checkbox } from 'material-ui';

import constants from '../constants';
import { toggleTray } from '../../actions/index';

import { FxPNG } from '../Icons';

class BurgerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  // eslint-disable-next-line no-unused-vars
  handleToggle(e, isChecked) {
    this.setState({ isChecked: !this.state.isChecked }, () => {
      this.props.toggleTray();
    });
  }

  render() {
    return (
      <IconButton
        onClick={this.handleToggle}
        style={{ padding: 0 }}
        iconStyle={{ color: constants.theme().textColorSecondary, width: 36, height: 36 }}
      >
        <FxPNG clicked={this.state.isChecked} />
      </IconButton>
    );
    // return (
    //   <Checkbox
    //     iconStyle={{
    //       width: 40,
    //       height: 40,
    //     }}
    //     checkedIcon={<FxPNG clicked={this.state.isChecked} />}
    //     uncheckedIcon={<MenuIcon style={{ fill: constants.theme().textColorSecondary }} />}
    //     onCheck={this.handleToggle}
    //   />
    // );
  }
}

BurgerButton.propTypes = {
  toggleTray: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleTray: props => dispatch(toggleTray(props)),
});

export default connect(null, mapDispatchToProps)(BurgerButton);
