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

        // Cargar TimeEntries
        if (user?.role === "ADMIN" || task.assignedTo.id === user?.id) {
          const entries = await apiService.getTimeEntriesByTask(task.id);
          setTimeEntries(entries);
        }
      } else {
        setError("Tarea no encontrada");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al cargar la tarea");
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
      setError("El título es requerido");
      return;
    }

    // Determinar qué campos se permiten editar
    type UpdateTaskData = Partial<{
      title: string;
      description: string;
      status: string;
      workDescription: string;
    }>;

    const updateData: UpdateTaskData = {};

    if (user?.role === "ADMIN") {
      // ADMIN puede editar todo
      updateData.title = formData.title.trim();
      updateData.description = formData.description.trim();
      updateData.status = formData.status;
      updateData.workDescription = formData.workDescription.trim();
    } else {
      // EMPLOYEE solo puede editar ciertos campos
      updateData.status = formData.status;
      updateData.workDescription = formData.workDescription.trim();
    }

    setLoading(true);
    try {
      await apiService.updateTask(Number(id), updateData);
      // Recargar la tarea para ver cambios
      await fetchTask();
      alert("✅ Tarea actualizada correctamente");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al actualizar la tarea");
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
      setError("Fecha y horas son requeridas");
      return;
    }

    const hours = parseFloat(timeEntryForm.hoursWorked);
    if (hours <= 0) {
      setError("Las horas deben ser mayor a 0");
      return;
    }

    try {
      if (editingTimeEntry) {
        // Editar TimeEntry existente
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
        // Crear nuevo TimeEntry
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
      
      // Actualizar la tarea para reflejar las horas nuevas
      await fetchTask();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar tiempo");
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
      
      // Actualizar tarea para reflejar las horas nuevas
      await fetchTask();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  // Corregir estas comparaciones según tu estructura de datos
  const isEmployee = user?.role === "EMPLOYEE";
  const isTaskAssignedToUser = taskInfo && taskInfo.assignedTo.id === user?.id;
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
            Volver a Tareas
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Editar Tarea
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actualiza los detalles y el estado de la tarea
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
                  Asignado a
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
                  Departamento
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {taskInfo.department?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Creada
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(taskInfo.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Horas Totales
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
              {/* Title Field - ADMIN only */}
              {!isEmployee && (
                <TextField
                  fullWidth
                  label="Título de la Tarea"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              )}

              {/* Description Field - ADMIN only */}
              {!isEmployee && (
                <TextField
                  fullWidth
                  label="Descripción"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Detalles de la tarea..."
                />
              )}

              {/* Status Field */}
              <TextField
                fullWidth
                select
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleChange}
                helperText="Actualiza el estado actual de la tarea"
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
                label="Descripción del Trabajo Realizado"
                name="workDescription"
                value={formData.workDescription}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Describe el trabajo completado en esta tarea..."
                helperText="Documenta lo que se realizó en esta tarea"
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
                  Cancelar
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
                  {loading ? "Guardando..." : "Guardar Cambios"}
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
              <Typography variant="h6" fontWeight="bold">
                ⏱️ Registros de Tiempo
              </Typography>
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
                Agregar Registro
              </Button>
            </Box>

            {/* Time Entries Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Horas</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No hay registros de tiempo
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {new Date(entry.date).toLocaleDateString("es-ES")}
                        </TableCell>
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
                            title="Editar"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTimeEntryId(entry.id)}
                            title="Eliminar"
                            sx={{ color: "error.main", ml: 1 }}
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
                <strong>Total de Horas Registradas:</strong>{" "}
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
                ? "Editar Registro de Tiempo"
                : "Nuevo Registro de Tiempo"}
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                name="date"
                value={timeEntryForm.date}
                onChange={handleTimeEntryChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="number"
                inputProps={{ step: 0.5, min: 0 }}
                label="Horas Trabajadas"
                name="hoursWorked"
                value={timeEntryForm.hoursWorked}
                onChange={handleTimeEntryChange}
                placeholder="ej: 3.5"
              />

              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={timeEntryForm.description}
                onChange={handleTimeEntryChange}
                multiline
                rows={3}
                placeholder="¿Qué hiciste?"
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setTimeEntryDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddTimeEntry}
                >
                  {editingTimeEntry ? "Actualizar" : "Agregar"}
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
              ¿Eliminar registro de tiempo?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Esta acción no se puede deshacer.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setDeleteTimeEntryId(null)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTimeEntry}
              >
                Eliminar
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Container>
    </MainLayout>
  );
}