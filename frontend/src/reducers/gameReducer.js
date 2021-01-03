import {
  ADD_TASK,
  CLEAR_CURRENT_GAME,
  LOAD_USER_GAMES,
  LOAD_VOTES_DISTRIBUTION,
  SET_CURRENT_GAME,
  VOTE_TASK,
} from "../actions/actionTypes";

const initialState = {
  currentGame: null,
  games: [],
};

const games = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_GAME:
      return {
        ...state,
        currentGame: action.payload.game,
      };
    case CLEAR_CURRENT_GAME:
      return {
        ...state,
        currentGame: null,
      };
    case ADD_TASK:
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          tasks: [action.payload, ...state.currentGame.tasks],
        },
      };
    case LOAD_VOTES_DISTRIBUTION:
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          votesDistribution: {
            ...state.currentGame.votesDistribution,
            [action.payload.id]: action.payload.vote_distribution,
          },
        },
      };
    case LOAD_USER_GAMES:
      return {
        ...state,
        games: action.payload,
      };
    case VOTE_TASK:
      const { taskId, complexity, prevComplexity } = action.payload;

      // Helper function to set the vote in provided distribution
      const setVote = (voteDistribution, complexity, prevComplexity) => {
        if (!voteDistribution) return;
        const votes = Object.assign({}, voteDistribution);
        if (prevComplexity !== null) {
          votes[prevComplexity] -= 1;
        }
        votes[complexity] ? votes[complexity]++ : (votes[complexity] = 1);
        return votes;
      };

      const task_votes = setVote(
        state.currentGame.votesDistribution[taskId],
        complexity,
        prevComplexity
      );
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          votesDistribution: {
            ...state.currentGame.votesDistribution,
            [taskId]: task_votes,
          },
        },
      };
    default:
      return state;
  }
};

export default games;
