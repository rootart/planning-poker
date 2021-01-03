import { createContext } from "react";
import { useSelector } from "react-redux";

export const authContext = createContext();

export const useProvideAuth = () => {
  const user = useSelector((state) => state.login.user);
  return {
    user,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
