export const toggleTray = (props = {}) => {
  const { state, width } = props;
  return ({
    type: 'TRAY',
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
