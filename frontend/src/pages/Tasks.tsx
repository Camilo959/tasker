// pages/Tasks.tsx - Material UI Version
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  TrendingUp as TrendingUpIcon,
  ListAlt as ListAltIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";
import type { Task } from "../types/task";

interface TaskStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  pending: number;
}

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const tasksData: Task[] = await apiService.getTasks();
      
      // Calculate stats
      const totalTasks = tasksData.length;
      const inProgress = tasksData.filter((t: Task) => t.status === "IN_PROGRESS").length;
      const completed = tasksData.filter((t: Task) => t.status === "DONE").length;
      const pending = tasksData.filter((t: Task) => t.status === "PENDING").length;
      
      setStats({
        totalTasks,
        inProgress,
        completed,
        pending,
      });
      
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "info";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "COMPLETED";
      case "IN_PROGRESS":
        return "IN PROGRESS";
      case "PENDING":
        return "PENDING";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const canEditTask = (task: Task) => {
    return user?.role === "ADMIN" || task.assignedToId === user?.userId;
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Task Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all your tasks and their progress.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/tasks/create")}
            sx={{
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Create Task
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Tasks */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.totalTasks.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "success.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      +12% this month
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    width: 56,
                    height: 56,
                  }}
                >
                  <ListAltIcon sx={{ color: "primary.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* In Progress */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.inProgress.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "success.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      +5% this week
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "info.light",
                    width: 56,
                    height: 56,
                  }}
                >
                  <PendingIcon sx={{ color: "info.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.completed.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "success.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      +18% increase
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "success.light",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CheckCircleIcon sx={{ color: "success.dark" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.pending.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "warning.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      Needs attention
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "warning.light",
                    width: 56,
                    height: 56,
                  }}
                >
                  <PendingIcon sx={{ color: "warning.dark" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tasks Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              All Tasks
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{ textTransform: "none" }}
              >
                Filter
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                sx={{ textTransform: "none" }}
              >
                Export
              </Button>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Requested By</TableCell> {/* 🔹 Nueva columna */}
                  <TableCell>Start Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No tasks found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="caption" color="text.secondary">
                            {task.description.substring(0, 50)}
                            {task.description.length > 50 ? "..." : ""}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                            {task.assignedTo.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {task.assignedTo.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {task.assignedTo.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                            {task.requestedBy.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {task.requestedBy.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {task.requestedBy.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(task.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(task.status)}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: 11 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {task.department?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          {canEditTask(task) && (
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tasks/edit/${task.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {tasks.length} of {stats.totalTasks} tasks
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" disabled>
                <Typography variant="caption">←</Typography>
              </IconButton>
              <IconButton size="small">
                <Typography variant="caption">→</Typography>
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}