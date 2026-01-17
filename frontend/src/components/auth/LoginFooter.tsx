import { Box, Typography, Link } from "@mui/material";

export default function LoginFooter() {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2" gutterBottom>
        © 2026 CorporateTask Inc. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1, display: "flex", gap: 2, justifyContent: "center" }}>
        <Link href="#" variant="body2" underline="hover">
          Privacy Policy
        </Link>
        <Link href="#" variant="body2" underline="hover">
          Terms of Service
        </Link>
        <Link href="#" variant="body2" underline="hover">
          Contact Support
        </Link>
      </Box>
    </Box>
  );
}
