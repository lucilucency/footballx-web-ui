import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
// import styled from 'styled-components';
// import constants from '../constants';

// TODO doesn't work with styled-components right now since overwriting the Button element causes material-ui to lose anchor context
/*
const StyledButton = styled(Button)`
  & svg {
    transform: rotate(${props => props.open ? '90deg' : '0deg'});
    fill: ${props => props.open ? `${constants.colorGolden} !important;` : ''}
    transition: ${constants.linearTransition};
  }
`;
*/

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  render() {
    const {
      Button, buttonProps, className, children,
    } = this.props;
    const { open } = this.state;
    return (
      <div className={className} style={{ overFlow: 'hidden' }}>
        <Button
          onClick={this.handleTouchTap}
          open={open}
          {...buttonProps}
          style={{
            padding: 0,
          }}
        />
        <Popover
          autoCloseWhenOffScreen={false}
          open={open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          // className={styles.popoverContainer}
          style={{
            // width: '100%',
            // maxWidth: 450,
            height: '50%',
            maxHeight: 400,
            overFlow: 'hidden',
          }}
        >
          <Menu style={{ overFlow: 'hidden' }}>
            {React.Children.map(children, child => (child ? (
              <MenuItem>
                {child}
              </MenuItem>
            ) : null))}
          </Menu>
        </Popover>
      </div>
    );
  }
}

Dropdown.propTypes = {
  Button: PropTypes.func,
  buttonProps: PropTypes.shape({}),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf({}),
    PropTypes.node,
  ]),
};

export default Dropdown;
