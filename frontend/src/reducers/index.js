import { combineReducers } from "redux";
import login from "./loginReducer";
import games from "./gameReducer";

const rootReducer = combineReducers({
  login,
  games,
});

export default rootReducer;
