import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import AutoLockScrolling from 'material-ui/internal/AutoLockScrolling';
import IconButton from 'material-ui/IconButton';
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components';
import ui from '../../theme';

const baseStyles = {
  root: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1500,
    background: 'rgba(0, 0, 0, .8)',
  },
  transition: {
    entering: {
      opacity: 0,
      transition: 'all 225ms cubic-bezier(0.0, 0.0, 0.2, 1)',
      transform: 'translate(0, 56px)',
    },
    entered: {
      opacity: 1,
      transition: 'all 225ms cubic-bezier(0.0, 0.0, 0.2, 1)',
      transform: 'translate(0, 0px)',
    },
    exiting: {
      opacity: 0,
      transition: 'all 195ms cubic-bezier(0.4, 0.0, 1, 1)',
      transform: 'translate(0, 56px)',
    },
    exited: {
      opacity: 0,
      display: 'none',
      transition: 'all 225ms cubic-bezier(0.0, 0.0, 0.2, 1)',
      transform: 'translate(0, 56px)',
    },
  },
  closeButton: {
    fontSize: '12px',
    // width: 88,
    // textAlign: 'right',
  },
};

const Wrapper = styled.div`
  margin: auto;
  overflow-y: auto;
  background: ${ui.backgroundColorPrimary};
  
  width: 80%;
  min-height: 100%;
  
  @media only screen and (max-width: 660px) {
    width: 100%;
    height: 100%;
    min-height: 100%;
    //min-height: 80%;
  }
`;

const Overlay = styled.div``;

const FullscreenDialogFrame = ({
  children,
  open,
  style,
  onRequestClose,
}) => (
  <Transition
    in={open}
    timeout={{ exit: 225, enter: 225 }}
    component="div"
    appear
    enter
  >
    {state => (
      <div
        style={{
          ...style,
          ...baseStyles.root,
          ...baseStyles.transition[state],
        }}
      >
        <Overlay
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
          onClick={onRequestClose}
        />
        <Wrapper>
          {children}
        </Wrapper>
        <AutoLockScrolling lock={open} />
      </div>
    )}
  </Transition>
);

FullscreenDialogFrame.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
  onRequestClose: PropTypes.func,
};

const getStyles = (props, theme) => {
  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    appBar: {
      height: (props.appBarStyle ? props.appBarStyle.height : null) || theme.appBar.height,
    },
    container: {
      flex: 1,
      overflow: 'auto',
      // marginTop: 33,
    },
  };

  if (props.immersive) {
    styles.appBar.background = ui.backgroundColorPrimary;
    styles.appBar.position = 'absolute';
  }

  return styles;
};

export default function FullscreenDialog(props, { muiTheme }) {
  const styles = getStyles(props, muiTheme);

  const {
    children,
    closeIcon,
    containerStyle,
    onRequestClose,
    open,
    style,
  } = props;

  return (
    <FullscreenDialogFrame
      open={open}
      style={{ ...style, ...styles.root }}
      onRequestClose={onRequestClose}
    >
      <IconButton
        onClick={onRequestClose}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
        }}
      >
        {closeIcon}
      </IconButton>
      <div style={{ ...styles.container, ...containerStyle }}>
        {children}
      </div>
    </FullscreenDialogFrame>
  );
}

FullscreenDialog.propTypes = {
  /**
   * Children elements.
   */
  children: PropTypes.node,
  /**
   * Icon element used for the dismissive action. This is hidden if `onRequestClose` is not set.
   */
  closeIcon: PropTypes.node,
  /**
   * Overrides the inline-style of the dialog's children container.
   */
  containerStyle: PropTypes.object,
  /**
   * Callback that is invoked when the dismissive action button is touched.
   */
  onRequestClose: PropTypes.func,
  /**
   * Controls whether the dialog is opened or not.
   */
  open: PropTypes.bool.isRequired,
  /**
   * Overrides the inline-style of the dialog's root element.
   */
  style: PropTypes.object,
};

FullscreenDialog.defaultProps = {
  appBarZDepth: 1,
  closeIcon: <NavigationCloseIcon color="#696b6f" hoverColor="white" />,
  // closeIcon: <p style={{...style.closeButton, fontSize: '12px'}}>Close</p>,
  immersive: false,
};

FullscreenDialog.contextTypes = {
  muiTheme: PropTypes.object,
};
