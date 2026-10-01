import { useState } from "react";
import Auth from "./Auth";
import Books from "./Books";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return token ? (
    <Books token={token} onLogout={handleLogout} />
  ) : (
    <Auth onLogin={handleLogin} />
  );
}