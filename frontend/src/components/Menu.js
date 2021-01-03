import React from "react";
import {
  AppBar,
  Link as UILink,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Filter5Icon from "@material-ui/icons/Filter5";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  link: {
    margin: theme.spacing(1, 2),
  },
}));

const Menu = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.login.user);

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          <Link to="/">
            <Filter5Icon />
          </Link>
        </Typography>
        <nav>
          {user ? (
            <UILink
              component={Link}
              to="#"
              variant="button"
              color="textPrimary"
              className={classes.link}
            >
              Welcome, {user.name}
            </UILink>
          ) : (
            <UILink
              component={Link}
              variant="button"
              color="textPrimary"
              className={classes.link}
              to="/register"
            >
              Register
            </UILink>
          )}
          <UILink
            component={Link}
            to="/games/start"
            variant="button"
            color="textPrimary"
            className={classes.link}
          >
            Start a new game
          </UILink>
          <UILink
            component={Link}
            to="/games/"
            variant="button"
            color="textPrimary"
            className={classes.link}
          >
            Games
          </UILink>
        </nav>
      </Toolbar>
    </AppBar>
  );
};
export default Menu;
