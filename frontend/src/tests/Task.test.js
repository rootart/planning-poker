import { render } from "./test-utils";

import TaskComponent from "../components/Task";
import { testGameId } from "./config";

const task = {
  id: 1,
  content: "Task 1, as a user",
  complexity: 0,
};
const gameId = testGameId;
const voteDistribution = {
  1: {
    0: 1,
    0.5: 0,
    1: 0,
  },
};

describe("Task component", () => {
  it("renders to snapshot", () => {
    const { container, getByText } = render(
      <TaskComponent
        task={task}
        gameId={gameId}
        votesDistribution={voteDistribution}
      />
    );
    expect(container).toMatchSnapshot();
    expect(getByText("Task 1, as a user")).toBeInTheDocument();
  });
});
