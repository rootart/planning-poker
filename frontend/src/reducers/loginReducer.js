import { LOGIN_USER } from "../actions/actionTypes";

const initialState = {
  user: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export default login;
