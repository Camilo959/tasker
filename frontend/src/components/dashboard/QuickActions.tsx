import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  Assignment,
  People,
  CorporateFare,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Props {
  isAdmin: boolean;
}

export function QuickActions({ isAdmin }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quick Actions
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <ActionCard
            icon={<Assignment />}
            label="Create Task"
            onClick={() => navigate("/tasks/create")}
          />
        </Grid>

        {isAdmin && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <ActionCard
                icon={<People />}
                label="Add User"
                onClick={() => navigate("/users/create")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <ActionCard
                icon={<CorporateFare />}
                label="Add Department"
                onClick={() => navigate("/departments/create")}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick} sx={{ cursor: "pointer" }}>
      <CardContent sx={{ textAlign: "center", py: 3 }}>
        {icon}
        <Typography fontWeight={600}>{label}</Typography>
      </CardContent>
    </Card>
  );
}
