import axios from "axios";
import { LOGIN_USER } from "./actionTypes";
import { API_BASE_URL } from "../config";

export const login = (history, from) => async (dispatch) => {
  const action = {
    type: LOGIN_USER,
    payload: {},
  };

  const response = await axios.get(`${API_BASE_URL}/users/me/`, {
    withCredentials: true,
  });
  action.payload.user = response.data;
  dispatch(action);
  history.replace(from);
};

export const registerUser = (username, history, from) => async (dispatch) => {
  await axios.post(
    `${API_BASE_URL}/users/`,
    {
      name: username,
    },
    {
      withCredentials: true,
    }
  );
  dispatch(login(history, from));
};
