// pages/EditDepartment.tsx - Material UI Version
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
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "../../components/layout/MainLayout";
import { apiService } from "../../services/api.service";
import type { Department } from "../../types/department";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setInitialLoading(true);
        const departments: Department[] = await apiService.getUsers();
        const department = departments.find((d) => d.id === Number(id));

        if (department) {
          setName(department.name);
        } else {
          setError("Department not found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load department");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Department name is required");
      return;
    }

    setLoading(true);
    try {
      await apiService.updateDepartment(Number(id), { name: name.trim() });
      navigate("/departments");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update department");
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
            onClick={() => navigate("/departments")}
            sx={{ mb: 2 }}
          >
            Back to Departments
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Department
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update department information
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Department Name Field */}
              <TextField
                fullWidth
                label="Department Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                helperText="Enter a descriptive name for this department"
              />

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
                  onClick={() => navigate("/departments")}
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

        {/* Warning Box */}
        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: "warning.lighter",
            border: 1,
            borderColor: "warning.light",
          }}
        >
          <Typography variant="body2" color="warning.dark" fontWeight={600} gutterBottom>
            ⚠️ Important:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Changing the department name will affect all associated tasks and users. 
            Make sure to inform relevant team members about this change.
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
}
