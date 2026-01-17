// pages/auth/Login.tsx - Material UI Version
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Box, Container } from "@mui/material";
import { LoginHeader, LoginForm, LoginFooter } from "../../components/auth";
import api from "../../api/axios";
import { useAuth } from "../../auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      {/* Header */}
      <LoginHeader />

      {/* Main Content */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          error={error}
          setError={setError}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Container>

      {/* Footer */}
      <LoginFooter />
    </Box>
  );
}
