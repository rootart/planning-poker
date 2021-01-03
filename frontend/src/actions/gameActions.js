import axios from "axios";
import {
  LOAD_USER_GAMES,
  LOAD_VOTES_DISTRIBUTION,
  SET_CURRENT_GAME,
} from "./actionTypes";
import { API_BASE_URL } from "../config";

/**
 * Adds task for the game. Further adding of the task into
 * the state is managed with WebSocket event broadcast to the clients
 * @param gameId
 * @param content
 * @returns {function(*): Promise<void>}
 */
export const addTask = (gameId, content) => async (dispatch) => {
  try {
    await axios.post(
      `${API_BASE_URL}/game/${gameId}/tasks/`,
      {
        content: content,
        complexity: 0,
      },
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const voteTask = (gameId, id, value) => async (dispatch) => {
  try {
    await axios.post(
      `${API_BASE_URL}/game/${gameId}/task/${id}/vote/`,
      {
        complexity: value,
      },
      { withCredentials: true }
    );
  } catch (err) {}
};

export const loadVotesDistribution = (gameId, id) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/game/${gameId}/task/${id}/`,
      {
        withCredentials: true,
      }
    );
    dispatch({
      type: LOAD_VOTES_DISTRIBUTION,
      payload: data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const loadGame = (gameId) => async (dispatch) => {
  try {
    const details = await axios.get(`${API_BASE_URL}/game/${gameId}/`, {
      withCredentials: true,
    });
    dispatch({
      type: SET_CURRENT_GAME,
      payload: {
        game: details.data,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const loadGames = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/games/`, {
      withCredentials: true,
    });
    dispatch({
      type: LOAD_USER_GAMES,
      payload: data,
    });
  } catch (err) {
    console.error(err);
  }
};
