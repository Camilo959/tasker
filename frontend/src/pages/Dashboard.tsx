// pages/Dashboard.tsx - Material UI Version (Solo Estadísticas Generales)
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  CorporateFare as CorporateFareIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";

interface DashboardStats {
  totalTasks: number;
  totalUsers: number;
  totalDepartments: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    totalUsers: 0,
    totalDepartments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const tasksData = await apiService.getTasks();
      const totalTasks = tasksData.length;
      
      // Fetch users and departments
      let totalUsers = 0;
      let totalDepartments = 0;
      
      if (user?.role === "ADMIN") {
        const usersData = await apiService.getUsers();
        const deptsData = await apiService.getDepartments();
        totalUsers = usersData.length;
        totalDepartments = deptsData.length;
      }
      
      setStats({
        totalTasks,
        totalUsers,
        totalDepartments,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || "User"}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your organization's current status.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3}>
          {/* Total Tasks Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate("/tasks")}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <AssignmentIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  </Avatar>
                  <IconButton size="small">
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Tasks
                </Typography>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {loading ? "..." : stats.totalTasks.toLocaleString()}
                </Typography>
                
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 2,
                    color: "success.main",
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight={600}>
                    +12% from last month
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Click to view all tasks and their details
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Users Card - Solo para Admin */}
          {user?.role === "ADMIN" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate("/users")}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.light",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <PeopleIcon sx={{ color: "secondary.main", fontSize: 28 }} />
                    </Avatar>
                    <IconButton size="small">
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {loading ? "..." : stats.totalUsers.toLocaleString()}
                  </Typography>
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 2,
                      color: "success.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      +8% new members
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Manage user accounts and permissions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Total Departments Card - Solo para Admin */}
          {user?.role === "ADMIN" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate("/departments")}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: "info.light",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <CorporateFareIcon sx={{ color: "info.main", fontSize: 28 }} />
                    </Avatar>
                    <IconButton size="small">
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Departments
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {loading ? "..." : stats.totalDepartments.toLocaleString()}
                  </Typography>
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 2,
                      color: "success.main",
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>
                      +2 new departments
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    View and organize departments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Quick Actions Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Common tasks you might want to perform
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/tasks/create")}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Create New Task
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/tasks")}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    View All Tasks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {user?.role === "ADMIN" && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "secondary.light",
                        color: "secondary.contrastText",
                      },
                    }}
                    onClick={() => navigate("/users/create")}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" fontWeight={600}>
                        Add New User
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "info.light",
                        color: "info.contrastText",
                      },
                    }}
                    onClick={() => navigate("/departments/create")}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <CorporateFareIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" fontWeight={600}>
                        Add Department
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Container>
    </MainLayout>
  );
}