// pages/CreateDepartment.tsx - Material UI Version
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";

export default function CreateDepartment() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Department name is required");
      return;
    }

    setLoading(true);
    try {
      await apiService.createDepartment({ name: name.trim() });
      navigate("/departments");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create department");
      }
    } finally {
      setLoading(false);
    }
  };

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
            Create New Department
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new department to your organization
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
                placeholder="e.g., Human Resources, Sales, IT..."
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
                  startIcon={<AddIcon />}
                  disabled={loading}
                  sx={{
                    minWidth: 150,
                  }}
                >
                  {loading ? "Creating..." : "Create Department"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Info Box */}
        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: "info.lighter",
            border: 1,
            borderColor: "info.light",
          }}
        >
          <Typography variant="body2" color="info.dark" fontWeight={600} gutterBottom>
            💡 Tips for Department Names:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, mt: 1 }}>
            <li>Use clear, descriptive names</li>
            <li>Keep it concise (2-3 words max)</li>
            <li>Use standard business terms</li>
            <li>Avoid abbreviations unless widely known</li>
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
}