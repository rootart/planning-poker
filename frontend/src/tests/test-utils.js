import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducers";
import thunk from "redux-thunk";

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState, applyMiddleware(thunk)),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
