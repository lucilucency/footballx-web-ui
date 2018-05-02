const initialFormState = {
  show: true,
  width: 210,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case 'TRAY':
      return {
        ...state,
        show: action.state || !state.show,
        width: action.width || initialFormState.width,
      };
    default:
      return state;
  }
};
