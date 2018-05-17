import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import AutoLockScrolling from 'material-ui/internal/AutoLockScrolling';
import IconButton from 'material-ui/IconButton';
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close';
import constants from '../../components/constants';

const styles = {
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

const FullscreenDialogFrame = ({ children, open, style }) => (
  <Transition
    in={open}
    timeout={{ exit: 225, enter: 225 }}
    component="div"
    appear
    enter
  >
    {state => (
      <div style={{
        ...style,
        ...styles.root,
        ...styles.transition[state],
      }}
      >
        <div
          style={{
            width: '80%',
            minHeight: '100%',
            margin: 'auto',
            overflowY: 'auto',
            background: constants.theme().backgroundColor,
          }}
        >
          {children}
        </div>
        <AutoLockScrolling lock={open} />
      </div>
    )}
  </Transition>
);

FullscreenDialogFrame.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
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
    styles.appBar.background = constants.theme().backgroundColor;
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
    >
      <IconButton
        onClick={onRequestClose}
        style={{
          position: 'absolute',
          right: 0,
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
   * Overrides the inline-styles of the dialog's children container.
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
   * Overrides the inline-styles of the dialog's root element.
   */
  style: PropTypes.object,
};

FullscreenDialog.defaultProps = {
  appBarZDepth: 1,
  closeIcon: <NavigationCloseIcon color="#696b6f" hoverColor="white" />,
  // closeIcon: <p style={{...styles.closeButton, fontSize: '12px'}}>Close</p>,
  immersive: false,
};

FullscreenDialog.contextTypes = {
  muiTheme: PropTypes.object,
};
