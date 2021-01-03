import { setupServer } from "msw/node";
import { rest } from "msw";
import { API_BASE_URL } from "./config";
import { testGameId } from "./tests/config";

export const server = setupServer(
  rest.get(`${API_BASE_URL}/game/${testGameId}/task/1/`, (req, res, ctx) => {
    return res(ctx.json({ id: 1, voteDistribution: { 0: 1 } }));
  })
);
server.listen({
  onUnhandledRequest: "error",
});
