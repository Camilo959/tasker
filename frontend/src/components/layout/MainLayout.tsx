// components/layout/MainLayout.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  CorporateFare as DepartmentIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard", roles: ["ADMIN", "EMPLOYEE"] },
    { text: "Tasks", icon: <AssignmentIcon />, path: "/tasks", roles: ["ADMIN", "EMPLOYEE"] },
    { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["ADMIN"] },
    { text: "Departments", icon: <DepartmentIcon />, path: "/departments", roles: ["ADMIN"] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || "EMPLOYEE")
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
            }}
          >
            <TaskAltIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              Task Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enterprise Suite
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 1.5, flex: 1 }}>
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    ...(isActive && {
                      bgcolor: alpha("#1976d2", 0.08),
                      color: "primary.main",
                      borderRight: 4,
                      borderColor: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Settings */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <ListItemButton
            sx={{ borderRadius: 2 }}
            onClick={() => navigate("/settings")}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Search */}
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                bgcolor: alpha("#000", 0.04),
                width: { xs: "auto", sm: 400 },
                maxWidth: "100%",
              }}
            >
              <Box
                sx={{
                  padding: "0 16px",
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SearchIcon sx={{ color: "text.secondary" }} />
              </Box>
              <InputBase
                placeholder="Search tasks, users, or reports..."
                sx={{
                  color: "inherit",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    padding: "8px 8px 8px 48px",
                    fontSize: 14,
                  },
                }}
              />
            </Box>

            {/* Right side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Notifications */}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* User Profile */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                }}
                onClick={handleProfileMenuOpen}
              >
                <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight={600}>
                    {user?.name || "User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role === "ADMIN" ? "Admin Access" : "Employee"}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    border: 2,
                    borderColor: alpha("#1976d2", 0.2),
                  }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate("/settings"); }}>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};