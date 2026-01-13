import { Box, Typography } from "@mui/material";

interface Props {
  userName?: string;
}

export function DashboardHeader({ userName }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, {userName || "User"}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Here's an overview of your organization's current status.
      </Typography>
    </Box>
  );
}
