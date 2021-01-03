import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box, Container, CssBaseline } from "@material-ui/core";
import Game from "./components/Game";
import Register from "./components/Register";
import NewGame from "./components/NewGame";
import Copyright from "./components/Copyright";
import About from "./components/About";
import Menu from "./components/Menu";
import { AuthProvider } from "./auth/context";
import AuthRoute from "./auth/router";
import Games from "./components/Games";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container component="main">
          <CssBaseline />
          <Menu />
          <Container maxWidth="md" component="main">
            <Switch>
              <Route exact path="/">
                <About />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <AuthRoute exact path="/games/start">
                <NewGame />
              </AuthRoute>
              <AuthRoute exact path="/game/:gameId">
                <Game />
              </AuthRoute>
              <AuthRoute exact path="/games">
                <Games />
              </AuthRoute>
            </Switch>
          </Container>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
