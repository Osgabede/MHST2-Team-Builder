import { createContext, useReducer } from 'react';

export const UsersContext = createContext();

const initialState = {
  users: null,
  auth: {
    user: null,
    token: null,
  },
};

export const usersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'CREATE_USER':
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: { user: null, token: null },
      };
    default:
      return state;
  }
};

export const UsersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  return (
    <UsersContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UsersContext.Provider>
  );
};
