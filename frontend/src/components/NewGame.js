import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { SET_CURRENT_GAME } from "../actions/actionTypes";
import { API_BASE_URL } from "../config";
import {
  Box,
  Button,
  FormControl,
  makeStyles,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  addGame: {
    width: "100%",
    margin: "10px",
  },
  gameNameInput: {
    marginBottom: "10px",
  },
}));

const NewGame = () => {
  const classes = useStyles();
  const [gameName, setGameName] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const createGame = async (name) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/games/`,
        { name },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      const messages = err.response.data.detail.map((detail) => detail.msg);

      throw new Error(messages.join(","));
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      const data = await createGame(gameName);
      history.push(`/game/${data.id}`);
      dispatch({
        type: SET_CURRENT_GAME,
        payload: {
          game: data,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Box>
      <FormControl className={classes.addGame}>
        <TextField
          error={error}
          className={classes.gameNameInput}
          label="Enter name for your next planning poker game"
          type="text"
          name="name"
          variant="outlined"
          helperText={error}
          onChange={(event) => setGameName(event.target.value)}
        />
        <Button variant="outlined" color="primary" onClick={submit}>
          Create new game
        </Button>
      </FormControl>
    </Box>
  );
};

export default NewGame;
