const initialFormState = {
  open: false,
  message: 'Hi, stranger',
  autoHideDuration: 5000,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case 'announcement':
      return {
        ...state,
        open: action.open,
        message: action.message || state.message,
        action: action.action || state.action,
        onActionClick: action.onActionClick || state.onActionClick,
        autoHideDuration: action.autoHideDuration || state.autoHideDuration,
      };
    default:
      return state;
  }
};
