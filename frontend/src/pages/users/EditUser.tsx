// pages/EditUser.tsx - Material UI Version
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "../../components/layout/MainLayout";
import { apiService } from "../../services/api.service";
import type { User } from "../../types/user";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
    isActive: true,
  });
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActiveState, setPendingActiveState] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setInitialLoading(true);
        const users: User[] = await apiService.getUsers();
        const user = users.find((u) => u.id === Number(id));

        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          });
        } else {
          setError("User not found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load user");
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [id]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiService.updateUser(Number(id), formData);
      navigate("/users");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update user");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/users")}
            sx={{ mb: 2 }}
          >
            Back to Users
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update user information and permissions
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* Role Field */}
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                helperText="Change user access level"
              >
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="ADMIN">Administrator</MenuItem>
              </TextField>
              
              {/* Active Status Field */}
              <TextField
                fullWidth
                select
                label="User Status"
                value={formData.isActive ? "ACTIVE" : "INACTIVE"}
                onChange={(e) => {
                  const newState = e.target.value === "ACTIVE";
                  if (newState !== formData.isActive) {
                    setPendingActiveState(newState);
                    setConfirmOpen(true);
                  }
                }}
                helperText="Deactivate users instead of deleting them"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </TextField>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/users")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    minWidth: 150,
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {pendingActiveState ? "Activate User" : "Deactivate User"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {pendingActiveState
              ? "Are you sure you want to activate this user?"
              : "Are you sure you want to deactivate this user? The user will no longer be able to log in."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            color={pendingActiveState ? "success" : "error"}
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                isActive: pendingActiveState ?? prev.isActive,
              }));
              setConfirmOpen(false);
              setPendingActiveState(null);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
