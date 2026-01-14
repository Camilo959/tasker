// pages/Login.tsx - Material UI Version
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  GoogleIcon,
} from "../components/icons/index";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

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
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
            }}
          >
            <CheckIcon size={20} />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            CorporateTask
          </Typography>
        </Box>
        <Button variant="contained" size="small">
          Help
        </Button>
      </Box>

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
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            width: "100%",
            maxWidth: 480,
            borderRadius: 2,
          }}
        >
          {/* Logo/Icon */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                width: 64,
                height: 64,
              }}
            >
              <CheckIcon size={36} />
            </Avatar>
          </Box>

          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter your details to sign in
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              placeholder="name@company.com"
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              placeholder="••••••••"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">Remember me</Typography>
                }
              />
              <Link
                href="#"
                variant="body2"
                color="primary"
                underline="hover"
                fontWeight={600}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>

            {/* Google Sign In */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Sign in with Google
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2" gutterBottom>
          © 2026 CorporateTask Inc. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 2, justifyContent: "center" }}>
          <Link href="#" variant="body2" underline="hover">
            Privacy Policy
          </Link>
          <Link href="#" variant="body2" underline="hover">
            Terms of Service
          </Link>
          <Link href="#" variant="body2" underline="hover">
            Contact Support
          </Link>
        </Box>
      </Box>
    </Box>
  );
}