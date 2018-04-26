const initialFormState = {
  show: true,
  width: 260,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case 'TRAY':
      return {
        ...state,
        show: !state.show,
      };
    default:
      return state;
  }
};
