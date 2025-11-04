import { useContext } from "react";
import AuthContext from "./AuthContext";

// Create a custom hook for easy context consumption
export const useAuth = () => {
  return useContext(AuthContext);
};