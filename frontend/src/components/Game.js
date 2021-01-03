import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Task from "./Task";
import { WS_BASE_URL } from "../config";
import { addTask, loadGame } from "../actions/gameActions";
import {
  ADD_TASK,
  CLEAR_CURRENT_GAME,
  VOTE_TASK,
  WS_CAST_VOTE,
  WS_PUBLISHED_TASK,
} from "../actions/actionTypes";
import {
  Box,
  Button,
  FormControl,
  makeStyles,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  addTaskForm: {
    width: "100%",
    margin: "10px",
  },
  taskNameInput: {
    marginBottom: "10px",
  },
}));

function Game() {
  const classes = useStyles();
  const { gameId } = useParams();
  const [taskName, setTasName] = useState(null);
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.games.currentGame);
  let ws;

  // Load game details and clear redux state on leaving the view
  useEffect(() => {
    dispatch(loadGame(gameId));

    return () => {
      dispatch({
        type: CLEAR_CURRENT_GAME,
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // close WebSocket connection
  useEffect(() => {
    ws = new WebSocket(`${WS_BASE_URL}/ws/${gameId}/`);
    ws.onmessage = ({ data }) => {
      let message = JSON.parse(data);
      if (typeof message === "string") {
        try {
          message = JSON.parse(message);
        } catch {
          console.log("error");
        }
      }

      switch (message.type) {
        case WS_PUBLISHED_TASK:
          dispatch({
            type: ADD_TASK,
            payload: {
              id: message.task_id,
              content: message.content,
            },
          });
          break;
        case WS_CAST_VOTE:
          dispatch({
            type: VOTE_TASK,
            payload: {
              taskId: message.task_id,
              gameId: gameId,
              complexity: message.complexity,
              prevComplexity: message.prev_complexity,
            },
          });
          break;
        default:
      }
    };

    return () => {
      // close WebSocket connection when component gets destroyed
      ws.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addTaskHandler = async (event) => {
    event.preventDefault();
    dispatch(addTask(gameId, taskName));
    setTasName("");
  };

  return (
    <>
      {currentGame && (
        <Box>
          <Typography variant="h3">
            Planning poker for the game "{currentGame.name}"
          </Typography>
          <FormControl className={classes.addTaskForm}>
            <TextareaAutosize
              className={classes.taskNameInput}
              rowsMin={5}
              rowsMax={10}
              variant="outlined"
              placeholder="Enter task details"
              name="taskName"
              value={taskName || ""}
              required
              pattern=".{3,255}"
              onChange={(event) => setTasName(event.target.value)}
            />
            <Button color="primary" variant="outlined" onClick={addTaskHandler}>
              Add task
            </Button>
          </FormControl>
          <div className="tasks">
            {currentGame.tasks && currentGame.tasks.length ? (
              currentGame.tasks.map((task) => (
                <Task
                  gameId={currentGame.id}
                  task={task}
                  key={task.id}
                  votesDistribution={
                    currentGame.votesDistribution &&
                    currentGame.votesDistribution[task.id]
                  }
                />
              ))
            ) : (
              <Typography>No tasks to estimate yet.</Typography>
            )}
          </div>
        </Box>
      )}
    </>
  );
}

export default Game;
