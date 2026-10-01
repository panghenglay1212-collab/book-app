import { useState } from "react";
import { request } from "./api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await request("/auth/register", {
          method: "POST",
          body: { username, password },
        });
      }
      const data = await request("/auth/login", {
        method: "POST",
        body: { username, password },
        isForm: true,
      });
      onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 mt-16 border rounded">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="w-full bg-blue-600 text-white rounded p-2">
          {mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        {mode === "login" ? "No account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}