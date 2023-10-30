import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const jwtToken = localStorage.getItem("jwtToken");
let decodedToken;

const initialState = {
  user: null,
};

if (jwtToken) {
  console.group("Token");
  console.log("Token encontrado en localStorage");
  console.log(jwtToken);
  console.groupEnd();

  try {
    decodedToken = jwtDecode(jwtToken);
    // Lógica para cuando el token se decodifica correctamente
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    // Lógica para cuando hay un error al decodificar el token
    alert("Error de código");
  }

  if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
    localStorage.clear();
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    if (userData === null) {
      localStorage.clear();
      dispatch({ type: "LOGOUT" });
    } else {
      localStorage.setItem("jwtToken", userData);
      dispatch({
        type: "LOGIN",
        payload: userData,
      });
    }
  }

  function logout() {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
