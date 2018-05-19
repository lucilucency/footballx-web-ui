/* eslint-disable no-else-return */
import update from 'react-addons-update';

export default (type, initialData) => (state = {
  loading: false,
  data: initialData || [],
}, action) => {
  switch (action.type) {
    /* get action */
    case `REQUEST/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/${type}`:
      if (action.payload) {
        return {
          ...state,
          loading: false,
          data: update(state.data, { $merge: action.payload }),
          error: null,
        };
      } else {
        return {
          ...state,
          loading: false,
          data: state.data,
          error: null,
        };
      }
    case `FAIL/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /* add action */
    case `REQUEST/ADD/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/ADD/${type}`:
      if (action.payload) {
        const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
        return {
          ...state,
          loading: false,
          data: update(newData, {
            $push: state.data,
          }),
          error: null,
        };
      }
      console.error(`error in merge payload OK/ADD/${type}`);
      return {
        ...state,
        loading: false,
        error: true,
      };
    case `FAIL/ADD/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /* edit action */
    // case `REQUEST/EDIT/${type}`:
    //   return {
    //     ...state,
    //     loading: true,
    //     error: null,
    //   };
    // case `OK/EDIT/${type}`:
    //   if (action.payload) {
    //     return {
    //       ...state,
    //       loading: false,
    //       data: update(state.data, { $merge: action.payload }),
    //       error: null,
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       loading: false,
    //       data: state.data,
    //       error: null,
    //     };
    //   }
    // case `FAIL/EDIT/${type}`:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.error,
    //   };

    case `REQUEST/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/EDIT_ARR/${type}`:
      if (action.payload && action.payload.id) {
        return {
          ...state,
          loading: false,
          data: state.data.map((todo) => {
            if (todo.id === action.payload.id) {
              return Object.assign({}, todo, action.payload);
            }

            return todo;
          }),
          error: null,
        };
      }
      console.error(`error in merge payload OK/EDIT_ARR/${type}`);
      return {
        ...state,
        loading: false,
        error: true,
      };
    case `FAIL/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /* query action */
    case `QUERY/${type}`:
      return {
        ...state,
        query: action.query,
      };

    default:
      return state;
  }
};
