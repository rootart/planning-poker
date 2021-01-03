import login from "../reducers/loginReducer";
import { LOGIN_USER, VOTE_TASK } from "../actions/actionTypes";
import { testGameId } from "./config";
import games from "../reducers/gameReducer";

describe("reducers from loginReducer", () => {
  it("user has an empty initial state", () => {
    expect(login(undefined, {})).toEqual({ user: null });
  });
  it("login user sets the state for the current user", () => {
    const action = {
      type: LOGIN_USER,
      payload: {
        user: {
          id: "312aeedb-8b88-4633-bad4-203a52188e1c",
          name: "demo",
          created: "2020-12-29T20:33:21.471730+00:00",
        },
      },
    };
    expect(login(undefined, action)).toEqual({ user: action.payload.user });
  });
});

describe("reducers from gameReducer", () => {
  it("vote task updates existing distribution", () => {
    const action = {
      type: VOTE_TASK,
      payload: {
        taskId: 1,
        gameId: testGameId,
        complexity: 1,
        prevComplexity: 3,
      },
    };

    const initialState = {
      currentGame: {
        id: testGameId,
        votesDistribution: {
          1: {
            3: 1,
          },
          2: {
            5: 1, // one vote for 5 points
          },
        },
      },
    };

    const expectedState = {
      currentGame: {
        id: testGameId,
        votesDistribution: {
          1: {
            1: 1, // prev complexity in the task changed from 3 -> 1
            3: 0,
          },
          2: {
            5: 1, // one vote for 5 points
          },
        },
      },
    };
    expect(games(initialState, action)).toEqual(expectedState);
  });
});
