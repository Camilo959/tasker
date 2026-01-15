// pages/EditTask.tsx - Material UI Version
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
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";
import type { Task } from "../types/task";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [taskInfo, setTaskInfo] = useState<Task | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setInitialLoading(true);
        const tasks: Task[] = await apiService.getTasks();
        const task = tasks.find((t) => t.id === Number(id));
        if (task) {
          setTaskInfo(task);
          setFormData({
            title: task.title,
            description: task.description || "",
            status: task.status,
          });
        } else {
          setError("Task not found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load task");
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTask();
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

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      await apiService.updateTask(Number(id), {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });
      navigate("/tasks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update task");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "success";
      case "IN_PROGRESS":
        return "info";
      case "PENDING":
        return "warning";
      default:
        return "default";
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
            onClick={() => navigate("/tasks")}
            sx={{ mb: 2 }}
          >
            Back to Tasks
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update task details and status
          </Typography>
        </Box>

        {/* Task Info Card */}
        {taskInfo && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "grey.50",
              border: 1,
              borderColor: "grey.200",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Assigned To
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {taskInfo.assignedTo.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {taskInfo.assignedTo.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {taskInfo.department?.name || "No department"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(taskInfo.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Current Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={taskInfo.status.replace("_", " ")}
                    color={getStatusColor(taskInfo.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Edit Form */}
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
                placeholder="Enter task details..."
              />

              {/* Status Field */}
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                helperText="Update the current status of this task"
              >
                <MenuItem value="PENDING">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="PENDING" color="warning" size="small" />
                    <Typography variant="body2">Pending</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="IN_PROGRESS">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="IN PROGRESS" color="info" size="small" />
                    <Typography variant="body2">In Progress</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="DONE">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="DONE" color="success" size="small" />
                    <Typography variant="body2">Done</Typography>
                  </Stack>
                </MenuItem>
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
                  onClick={() => navigate("/tasks")}
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
            📝 Note:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To change the assigned user or department, please create a new task or contact an administrator.
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
}