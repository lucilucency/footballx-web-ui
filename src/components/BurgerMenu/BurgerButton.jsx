import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
// import Avatar from 'material-ui/Avatar';

import ui from '../../theme';
import { toggleTray } from '../../actions/index';

import { LogoRound } from '../Icons';

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
    // const { community } = this.props;
    // const icon = community && community.icon ? <Avatar src={community.icon} /> : <LogoRound clicked={this.state.isChecked} />;
    const icon = <LogoRound clicked={this.state.isChecked} />;

    return (
      <IconButton
        onClick={this.handleToggle}
        style={{ padding: 0 }}
        iconStyle={{ color: ui.alternateTextColor, width: 36, height: 36 }}
      >
        {icon}
      </IconButton>
    );
  }
}

BurgerButton.propTypes = {
  toggleTray: PropTypes.func,
  // community: PropTypes.object,
};

// const mapStateToProps = state => ({
//   community: state.app.community.data,
// });

const mapDispatchToProps = dispatch => ({
  toggleTray: props => dispatch(toggleTray(props)),
});

export default connect(null, mapDispatchToProps)(BurgerButton);
