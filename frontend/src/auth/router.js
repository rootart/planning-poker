import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "./context";

const AuthRoute = ({ children, ...rest }) => {
  let auth = useContext(authContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/register",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default AuthRoute;
