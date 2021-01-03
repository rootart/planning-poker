import React, { useState } from "react";
import { login, registerUser } from "../actions/loginActions";
import { useDispatch } from "react-redux";
import { Button, TextField, Box, Typography } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const handleSubmit = () => {
    dispatch(registerUser(username, history, from));
    setUsername("");
  };
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box m={1} xs={6}>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(login(history, from));
          }}
        >
          Login
        </Button>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          aperiam dolores fugiat in, laboriosam necessitatibus nesciunt numquam
          quidem quisquam voluptate! Corporis deleniti, facilis fugiat in
          repellat saepe ullam vitae voluptates.
        </Typography>
      </Box>
      <Box m={1} xs={6}>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label="Enter your username"
            variant="outlined"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
          <Button variant="outlined" onClick={handleSubmit}>
            Register
          </Button>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias
            architecto asperiores aspernatur aut consequatur deleniti est fugit
            impedit, itaque iure mollitia nam, non nostrum placeat rem tempora,
            veritatis voluptatibus.
          </Typography>
        </form>
      </Box>
    </Box>
  );
}

export default Register;
