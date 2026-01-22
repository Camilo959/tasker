import {
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import { EyeIcon, EyeOffIcon, CheckIcon } from "../icons/index";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  setError,
  loading,
  onSubmit,
}: LoginFormProps) {
  return (
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
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={4} marginTop={3}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@company.com"
            autoComplete="email"
            autoFocus
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
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
        </Stack>
      </Box>
    </Paper>
  );
}