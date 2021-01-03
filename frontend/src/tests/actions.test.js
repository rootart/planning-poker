import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../actions/gameActions";
import { testGameId } from "./config";
import { LOAD_VOTES_DISTRIBUTION } from "../actions/actionTypes";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("action creators ", () => {
  it("loadVotesDistribution dispatches events", async () => {
    const store = mockStore({
      currentGame: {
        id: testGameId,
        tasks: [
          {
            id: 1,
          },
        ],
      },
    });
    await store.dispatch(actions.loadVotesDistribution(testGameId, 1));
    expect(store.getActions()).toEqual([
      {
        payload: { id: 1, voteDistribution: { 0: 1 } },
        type: LOAD_VOTES_DISTRIBUTION,
      },
    ]);
  });
});
