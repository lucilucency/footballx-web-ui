export const toggleTray = (props = {}) => {
  const { state, width } = props;
  return ({
    type: 'TRAY/TOGGLE',
    state,
    width,
  });
};

export const setTray = (props = {}) => {
  const { state, width } = props;
  return ({
    type: 'TRAY/SET',
    state,
    width,
  });
};

export const announce = ({
  open = true,
  message,
  action,
  onActionClick,
  autoHideDuration,
}) => ({
  type: 'announcement',
  open,
  message,
  action,
  onActionClick,
  autoHideDuration,
});
