import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "../../components/layout/MainLayout";
import { apiService } from "../../services/api.service";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Department {
  id: number;
  name: string;
}

export default function CreateTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedToId: "",
    departmentId: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, deptsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getDepartments(),
      ]);
      
      setUsers(usersData);
      setDepartments(deptsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar usuarios y departamentos");
    }
  };

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

    if (!formData.title.trim()) {
      setError("El título es requerido");
      return;
    }

    if (!formData.assignedToId) {
      setError("Por favor asigna la tarea a un usuario");
      return;
    }

    setLoading(true);
    try {
      await apiService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        assignedToId: Number(formData.assignedToId),
        departmentId: formData.departmentId
          ? Number(formData.departmentId)
          : null,
      });
      alert("✅ Tarea creada correctamente");
      navigate("/tasks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al crear la tarea");
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
            onClick={() => navigate("/tasks")}
            sx={{ mb: 2 }}
          >
            Back to Tasks
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create New Task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new task and assign it to a team member
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Title Field */}
              <TextField
                fullWidth
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Complete Q4 Financial Report"
                autoFocus
              />

              {/* Description Field */}
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter task details and requirements..."
                helperText="Provide clear instructions and context for this task"
              />

              {/* Assigned User and Department - Two Columns */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Assign To"
                    name="assignedToId"
                    value={formData.assignedToId}
                    onChange={handleChange}
                    required
                    helperText="Select the responsible user"
                  >
                    <MenuItem value="">
                      <em>Select user</em>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Department"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    helperText="Optional - Select department"
                  >
                    <MenuItem value="">
                      <em>No department</em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

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
                  onClick={() => navigate("/tasks")}
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
                  {loading ? "Creating..." : "Create Task"}
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
          <Typography
            variant="body2"
            color="info.dark"
            fontWeight={600}
            gutterBottom
          >
            💡 Tips for Creating Tasks:
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="ul"
            sx={{ pl: 2, mt: 1 }}
          >
            <li>Use clear, action-oriented titles</li>
            <li>Provide detailed descriptions with requirements</li>
            <li>Assign to the most appropriate team member</li>
            <li>Include deadlines or priority information in the description</li>
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
}