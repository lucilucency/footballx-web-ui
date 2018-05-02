const TOGGLE_SHOW_FORM = 'form/TOGGLE_SHOW_FORM';

export const formActions = {
  TOGGLE_SHOW_FORM,
};

export const toggleShowForm = (formName, state) => ({
  type: TOGGLE_SHOW_FORM,
  formName,
  state,
});

export const toggleTray = (props = {}) => {
  const { state, width } = props;
  return ({
    type: 'TRAY',
    state,
    width,
  });
};
