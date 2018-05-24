const initialFormState = {
  show: true,
  width: 241,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case 'TRAY/TOGGLE':
      return {
        ...state,
        show: !state.show,
        width: action.width || initialFormState.width,
      };
    case 'TRAY/SET':
      return {
        ...state,
        show: action.state,
        width: action.width || initialFormState.width,
      };

    default:
      return state;
  }
};
