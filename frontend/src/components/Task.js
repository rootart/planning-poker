import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { VOTE_OPTIONS } from "../config";
import { loadVotesDistribution, voteTask } from "../actions/gameActions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "calc(100%/9)",
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: 10,
    textAlign: "center",
  },
  cardHeader: {
    minHeight: 30,
  },
  cards: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10px",
  },
  cardTitle: {
    borderBottom: "2px dotted #ccc",
  },
}));

const Task = ({ task, gameId, votesDistribution }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { content } = task;
  const vote = async ({ id }, value) => {
    dispatch(voteTask(gameId, id, value));
  };

  useEffect(() => {
    dispatch(loadVotesDistribution(gameId, task.id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const cardsWithVotes = VOTE_OPTIONS.map((value) => {
    return {
      label: value,
      value,
      voted: votesDistribution && votesDistribution[value],
    };
  });
  return (
    <Box>
      <Box xs={12} m={3}>
        <Typography variant="h5" className={classes.cardTitle}>
          {content}
        </Typography>
      </Box>
      <Box m={2} className={classes.cards}>
        {cardsWithVotes.map(({ label, value, voted }) => (
          <Card
            className={classes.root}
            onClick={async () => await vote(task, value)}
            key={value}
          >
            <CardHeader
              className={classes.cardHeader}
              title={voted ? `${voted}` : ""}
            ></CardHeader>
            <CardActionArea>
              <CardContent>
                <Typography variant="h6">{label}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    votesDistribution: PropTypes.object,
  }),
};

export default Task;
