import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FBDA61",
          backgroundImage: "linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link to="/status" variant="body2">
              <Button
                startIcon={<HomeIcon />}
                color="inherit"
                sx={{
                  marginRight: 4,
                  color: "white",
                  backgroundColor: "#424242",
                  "&:hover": {
                    backgroundColor: "#616161",
                  },
                }}
              >
                Home
              </Button>
            </Link>
            <Link to="/history" variant="body2">
              <Button
                startIcon={<HistoryIcon />}
                color="inherit"
                sx={{
                  color: "white",
                  backgroundColor: "#424242",
                  "&:hover": {
                    backgroundColor: "#616161",
                  },
                }}
              >
                History
              </Button>
            </Link>
          </Box>
          <Link to="/" variant="body2">
            <Button
              startIcon={<LogoutIcon />}
              color="inherit"
              sx={{
                color: "white",
                backgroundColor: "#424242",
                "&:hover": {
                  backgroundColor: "#616161",
                },
              }}
            >
              Logout
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
