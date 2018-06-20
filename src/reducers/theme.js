import { savedTheme } from '../theme';

const initialFormState = {
  name: savedTheme,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case 'THEME/SET':
      return {
        ...state,
        name: action.name,
      };

    default:
      return state;
  }
};
