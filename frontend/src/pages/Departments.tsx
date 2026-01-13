// pages/Departments.tsx - Material UI Version
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  Paper,
  Stack,
  InputBase,
  alpha,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  TrendingUp as TrendingUpIcon,
  CorporateFare as CorporateFareIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Engineering as EngineeringIcon,
  Campaign as CampaignIcon,
  Groups as GroupsIcon,
  Payments as PaymentsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";
import type { Department } from "../types/department";

interface DepartmentStats {
  totalDepartments: number;
  totalMembers: number;
  averageMembers: number;
}

const departmentIcons: Record<string, ReactElement> = {
  Engineering: <EngineeringIcon />,
  Marketing: <CampaignIcon />,
  "Human Resources": <GroupsIcon />,
  Sales: <PaymentsIcon />,
  default: <CorporateFareIcon />,
};


export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<DepartmentStats>({
    totalDepartments: 0,
    totalMembers: 0,
    averageMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Filter departments based on search term
    if (searchTerm) {
      const filtered = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  }, [searchTerm, departments]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const deptsData: Department[] = await apiService.getDepartments();

      // For now, we'll use mock member counts
      // In a real app, this would come from the API
      const totalDepartments = deptsData.length;
      const totalMembers = totalDepartments * 15; // Mock data
      const averageMembers = totalDepartments > 0 ? Math.round(totalMembers / totalDepartments) : 0;

      setStats({
        totalDepartments,
        totalMembers,
        averageMembers,
      });

      setDepartments(deptsData);
      setFilteredDepartments(deptsData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete department "${name}"?`)) {
      return;
    }

    try {
      await apiService.deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department");
    }
  };

  const getDepartmentIcon = (name: string) => {
    return departmentIcons[name] || departmentIcons.default;
  };

  const getMockMemberCount = (id: number) => {
    // Mock data for member counts
    const counts = [24, 12, 5, 18, 8, 15, 20];
    return counts[id % counts.length] || 10;
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
              Department Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organize and manage your organizational structure.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/departments/create")}
            sx={{
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            New Department
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Departments */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Departments
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.totalDepartments}
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
                      +2 this quarter
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
                  <CorporateFareIcon sx={{ color: "primary.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Members */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Members
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.totalMembers}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "info.main",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Across all departments
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
                  <GroupsIcon sx={{ color: "info.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Members */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Avg. Members
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.averageMembers}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                      color: "secondary.main",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Per department
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "secondary.light",
                    width: 56,
                    height: 56,
                  }}
                >
                  <GroupsIcon sx={{ color: "secondary.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              bgcolor: alpha("#000", 0.04),
              width: { xs: "100%", sm: 400 },
            }}
          >
            <Box
              sx={{
                padding: "0 12px",
                height: "100%",
                position: "absolute",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </Box>
            <InputBase
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                color: "inherit",
                width: "100%",
                "& .MuiInputBase-input": {
                  padding: "10px 10px 10px 40px",
                  fontSize: 14,
                },
              }}
            />
          </Box>
        </Box>

        {/* Departments Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">Loading departments...</Typography>
          </Box>
        ) : filteredDepartments.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center" }}>
            <CorporateFareIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? "No departments found" : "No departments yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first department to get started"}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/departments/create")}
              >
                Create Department
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredDepartments.map((dept) => (
              <Grid key={dept.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.light",
                          width: 48,
                          height: 48,
                        }}
                      >
                        {getDepartmentIcon(dept.name)}
                      </Avatar>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/departments/edit/${dept.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dept.name}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1} alignItems="center">
                      <GroupsIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {getMockMemberCount(dept.id)} members
                      </Typography>
                    </Stack>

                    {dept.createdAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                        Created {new Date(dept.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
}