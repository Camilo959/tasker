import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Alert,
  MenuItem,
  Stack,
  CircularProgress,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { MainLayout } from "../../components/layout/MainLayout";
import { apiService } from "../../services/api.service";
import { useAuth } from "../../auth/useAuth";
import type { Task, TimeEntry } from "../../types/task";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Task form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    workDescription: "",
  });

  // Time entry data
  const [timeEntryForm, setTimeEntryForm] = useState({
    date: new Date().toISOString().split("T")[0],
    hoursWorked: "",
    description: "",
  });

  // State
  const [taskInfo, setTaskInfo] = useState<Task | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dialogs
  const [timeEntryDialogOpen, setTimeEntryDialogOpen] = useState(false);
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null);
  const [deleteTimeEntryId, setDeleteTimeEntryId] = useState<number | null>(null);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setInitialLoading(true);
      const tasks = await apiService.getTasks();
      const task = tasks.find((t) => t.id === Number(id));

      if (task) {
        setTaskInfo(task);
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
          workDescription: task.workDescription || "",
        });

        // === Aquí es donde verificas los time entries ===
      console.log("User role:", user?.role);
      console.log("Task assignedToId:", task.assignedTo.id);
      console.log("Current userId:", user?.id);

        // Load TimeEntries
        if (user?.role === "ADMIN" || task.assignedTo.id === user?.id) {
          console.log("Fetching time entries for task:", task.id); // 🧪 Debug
          const entries = await apiService.getTimeEntriesByTask(task.id);
          setTimeEntries(entries);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error loading task");
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeEntryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTimeEntryForm((prev) => ({
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

    type UpdateTaskData = Partial<{
      title: string;
      description: string;
      status: string;
      startDate: string;
      workDescription: string;
    }>;

    const updateData: UpdateTaskData = {};

    if (user?.role === "ADMIN") {
      // ADMIN can edit everything
      updateData.title = formData.title.trim();
      updateData.description = formData.description.trim();
      updateData.status = formData.status;
      updateData.workDescription = formData.workDescription.trim();
    } else {
      // EMPLOYEE can only edit certain fields
      updateData.status = formData.status;
      updateData.workDescription = formData.workDescription.trim();
    }

    setLoading(true);
    try {
      await apiService.updateTask(Number(id), updateData);
      // Reload task to see changes
      await fetchTask();
      alert("✅ Task updated successfully");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating task");
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== TIME ENTRIES ==========
  const handleAddTimeEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!timeEntryForm.date || !timeEntryForm.hoursWorked) {
      setError("Date and hours are required");
      return;
    }

    const hours = parseFloat(timeEntryForm.hoursWorked);
    if (hours <= 0) {
      setError("Hours must be greater than 0");
      return;
    }

    try {
      if (editingTimeEntry) {
        // Edit existing TimeEntry
        const updated = await apiService.updateTimeEntry(editingTimeEntry.id, {
          date: timeEntryForm.date,
          hoursWorked: hours,
          description: timeEntryForm.description,
        });

        setTimeEntries(
          timeEntries.map((t) => (t.id === updated.id ? updated : t))
        );
        setEditingTimeEntry(null);
      } else {
        // Create new TimeEntry
        const newEntry = await apiService.createTimeEntry({
          taskId: Number(id),
          date: timeEntryForm.date,
          hoursWorked: hours,
          description: timeEntryForm.description,
        });

        setTimeEntries([...timeEntries, newEntry]);
      }

      // Reset form
      setTimeEntryForm({
        date: new Date().toISOString().split("T")[0],
        hoursWorked: "",
        description: "",
      });
      setTimeEntryDialogOpen(false);

      // Update task to reflect new hours
      await fetchTask();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error recording time");
      }
    }
  };

  const handleEditTimeEntry = (entry: TimeEntry) => {
    setEditingTimeEntry(entry);
    setTimeEntryForm({
      date: entry.date.split("T")[0],
      hoursWorked: entry.hoursWorked.toString(),
      description: entry.description || "",
    });
    setTimeEntryDialogOpen(true);
  };

  const handleDeleteTimeEntry = async () => {
    if (!deleteTimeEntryId) return;

    try {
      await apiService.deleteTimeEntry(deleteTimeEntryId);
      setTimeEntries(timeEntries.filter((t) => t.id !== deleteTimeEntryId));
      setDeleteTimeEntryId(null);

      // Update task to reflect new hours
      await fetchTask();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const isEmployee = user?.role === "EMPLOYEE";
  const isTaskAssignedToUser = taskInfo && taskInfo.assignedTo.id === user?.id;

  // ✅ El usuario asignado DEBE poder ver y editar time entries
  // ✅ ADMIN puede ver/editar time entries de cualquier tarea
  const canEditTimeEntries = user?.role === "ADMIN" || isTaskAssignedToUser;

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
            Update task details and track progress
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
                  {taskInfo.department?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Created On
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(taskInfo.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Started On
                </Typography>
                {taskInfo.startDate ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "success.main" }} />
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(taskInfo.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                ) : (
                  <Chip
                    label="Not started yet"
                    size="small"
                    color="default"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Hours
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimerIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {taskInfo.hoursSpent || 0}h
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Edit Form */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Title Field - Read-only for EMPLOYEE */}
              <TextField
                fullWidth
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isEmployee}
                required={!isEmployee}
                autoFocus={!isEmployee}
                helperText={isEmployee ? "📌 This field can only be edited by admins" : ""}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                    cursor: 'not-allowed',
                  },
                }}
              />

              {/* Description Field - Read-only for EMPLOYEE */}
              <TextField
                fullWidth
                label="Task Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isEmployee}
                multiline
                rows={3}
                placeholder="Task requirements and details..."
                helperText={isEmployee ? "📋 Instructions from admin - what needs to be done" : "Detailed instructions for the assignee"}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                    cursor: 'not-allowed',
                  },
                }}
              />

              {/* Status Field */}
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                helperText={
                  formData.status === "PENDING" && !taskInfo?.startDate
                    ? "💡 Changing to IN_PROGRESS will automatically set the start date"
                    : "Update the current task status"
                }
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

              {/* Work Description Field */}
              <TextField
                fullWidth
                label="Work Description"
                name="workDescription"
                value={formData.workDescription}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Document what you did, challenges faced, solutions implemented..."
                helperText="📝 What did you accomplish? (visible to admins and for reporting)"
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

        {/* TIME ENTRIES SECTION */}
        {canEditTimeEntries && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  ⏱️ Time Tracking
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isEmployee
                    ? "Track the hours you've worked on this task"
                    : "View and manage time entries for this task"
                  }
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingTimeEntry(null);
                  setTimeEntryForm({
                    date: new Date().toISOString().split("T")[0],
                    hoursWorked: "",
                    description: "",
                  });
                  setTimeEntryDialogOpen(true);
                }}
              >
                Add Time Entry
              </Button>
            </Box>

            {/* Time Entries Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>Date</TableCell>
                    {user?.role === "ADMIN" && <TableCell>Logged By</TableCell>}
                    <TableCell align="center">Hours</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={user?.role === "ADMIN" ? 5 : 4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          No time entries yet. Click "Add Time Entry" to start tracking your work.
                        </Typography>
                        {isEmployee && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            💡 Tip: Log your hours daily for accurate time tracking
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {new Date(entry.date).toLocaleDateString("en-US")}
                        </TableCell>
                        {user?.role === "ADMIN" && (
                          <TableCell>
                            <Typography variant="body2" fontSize="0.85rem">
                              {entry.user.name}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          {entry.hoursWorked}h
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {entry.description || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEditTimeEntry(entry)}
                            title="Edit"
                            disabled={user?.role !== "ADMIN" && entry.user.id !== user?.id}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTimeEntryId(entry.id)}
                            title="Delete"
                            sx={{ color: "error.main", ml: 1 }}
                            disabled={user?.role !== "ADMIN" && entry.user.id !== user?.id}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Summary */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Hours Logged:</strong>{" "}
                {timeEntries.reduce((sum, t) => sum + t.hoursWorked, 0)}h
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Time Entry Dialog */}
        <Dialog
          open={timeEntryDialogOpen}
          onClose={() => setTimeEntryDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingTimeEntry
                ? "Edit Time Entry"
                : "New Time Entry"}
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                name="date"
                value={timeEntryForm.date}
                onChange={handleTimeEntryChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="number"
                inputProps={{ step: 0.5, min: 0 }}
                label="Hours Worked"
                name="hoursWorked"
                value={timeEntryForm.hoursWorked}
                onChange={handleTimeEntryChange}
                placeholder="e.g., 3.5"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={timeEntryForm.description}
                onChange={handleTimeEntryChange}
                multiline
                rows={3}
                placeholder="What did you work on?"
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setTimeEntryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddTimeEntry}
                >
                  {editingTimeEntry ? "Update" : "Add"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Dialog>

        {/* Delete Time Entry Dialog */}
        <Dialog
          open={deleteTimeEntryId !== null}
          onClose={() => setDeleteTimeEntryId(null)}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delete time entry?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setDeleteTimeEntryId(null)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTimeEntry}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Container>
    </MainLayout>
  );
}