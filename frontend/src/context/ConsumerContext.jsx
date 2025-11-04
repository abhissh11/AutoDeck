import { useContext } from "react";
import AuthContext from "./AuthContext";

// 3. Create a custom hook for easy context consumption
export const useAuth = () => {
  return useContext(AuthContext);
};