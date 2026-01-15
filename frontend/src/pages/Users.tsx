// pages/Users.tsx - Material UI Version
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
  InputBase,
  alpha,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { apiService } from "../services/api.service";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  employeeUsers: number;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    employeeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData: User[] = await apiService.getUsers();

      // Calculate stats
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter((u) => u.isActive).length;
      const adminUsers = usersData.filter((u) => u.role === "ADMIN").length;
      const employeeUsers = usersData.filter((u) => u.role === "EMPLOYEE").length;

      setStats({
        totalUsers,
        activeUsers,
        adminUsers,
        employeeUsers,
      });

      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
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
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage organizational structure and control user access levels.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/users/create")}
            sx={{
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Add New User
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Users */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.totalUsers}
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
                      +8% new members
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
                  <PeopleIcon sx={{ color: "primary.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Users */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.activeUsers}
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
                    <Typography variant="body2" fontWeight={600}>
                      {stats.totalUsers > 0
                        ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`
                        : "0%"}{" "}
                      active rate
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
                  <PeopleIcon sx={{ color: "success.dark" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Admin Users */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Administrators
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.adminUsers}
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
                      Full access level
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
                  <AdminIcon sx={{ color: "info.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>

          {/* Employee Users */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Employees
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.employeeUsers}
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
                      Standard access
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
                  <PeopleIcon sx={{ color: "secondary.main" }} />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Table Toolbar */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              User Directory
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Search Box */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  bgcolor: alpha("#000", 0.04),
                  width: { xs: "100%", sm: 300 },
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
                  placeholder="Search by name, email or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    color: "inherit",
                    width: "100%",
                    "& .MuiInputBase-input": {
                      padding: "8px 8px 8px 40px",
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

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
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm ? "No users found matching your search" : "No users found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === "ADMIN" ? "primary" : "default"}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: 11 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: user.isActive ? "success.main" : "grey.400",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color={user.isActive ? "success.main" : "text.secondary"}
                            fontWeight={500}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                          >
                            <EditIcon fontSize="small" />
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
              Showing {filteredUsers.length} of {stats.totalUsers} users
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