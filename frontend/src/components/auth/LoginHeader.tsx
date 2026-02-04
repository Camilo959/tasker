import { Box, Avatar, Typography } from "@mui/material";
import { CheckIcon } from "../icons/index";

export default function LoginHeader() {
  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 32,
            height: 32,
          }}
        >
          <CheckIcon size={20} />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          CorporateTask
        </Typography>
      </Box>
    </Box>
  );
}
