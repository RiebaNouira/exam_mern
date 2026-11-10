import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

// Restore a saved session when the app first loads.
function getSavedAuth() {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!savedToken || !savedUser) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(savedUser), token: savedToken };
  } catch (error) {
    console.error("Could not restore the saved user session:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  // The initializer reads localStorage once, before the first render.
  const [auth, setAuth] = useState(getSavedAuth);

  // Save the API response in React and localStorage after a successful login.
  function saveAuth(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuth({ user: data.user, token: data.token });
    return data.user;
  }

  // Ask the server to check the email and password, then save its response.
  async function login(email, password) {
    const response = await axiosClient.post("/auth/login", { email, password });
    return saveAuth(response.data);
  }

  // Create an account on the server and save the returned signed-in session.
  async function register(name, email, password) {
    const response = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return saveAuth(response.data);
  }

  // Remove the saved session and immediately update every component using this context.
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null });
  }

  // Make authentication values and actions available to all child components.
  return (
    <AuthContext.Provider
      value={{ user: auth.user, token: auth.token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Let components read the authentication context without passing props.
export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return auth;
}
