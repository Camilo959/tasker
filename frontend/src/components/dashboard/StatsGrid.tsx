import Grid from "@mui/material/Grid";
import {
  Assignment,
  People,
  CorporateFare,
} from "@mui/icons-material";
import { StatsCard } from "./StatsCard";
import type { DashboardStats } from "./types";
import { useNavigate } from "react-router-dom";

interface Props {
  stats: DashboardStats;
  loading: boolean;
  isAdmin: boolean;
}

export function StatsGrid({ stats, loading, isAdmin }: Props) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          loading={loading}
          icon={<Assignment />}
          description="View and manage all tasks"
          onClick={() => navigate("/tasks")}
          color="primary"
        />
      </Grid>

      {isAdmin && (
        <>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              loading={loading}
              icon={<People />}
              description="Manage users and permissions"
              onClick={() => navigate("/users")}
              color="secondary"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StatsCard
              title="Departments"
              value={stats.totalDepartments}
              loading={loading}
              icon={<CorporateFare />}
              description="View and organize departments"
              onClick={() => navigate("/departments")}
              color="info"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
