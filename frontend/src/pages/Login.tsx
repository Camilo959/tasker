import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔹 usar contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // 🔐 Guardar token y user en el contexto
      // Si tu backend no devuelve user, puedes pasar solo token
      login(res.data.token, res.data.user);

      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      } else {
        setError("Error inesperado");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
