import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  onClick: () => void;
  loading?: boolean;
  color: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  onClick,
  loading,
  color,
}: Props) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <IconButton size="small">
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Typography variant="h3" fontWeight="bold">
          {loading ? "..." : value.toLocaleString()}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
