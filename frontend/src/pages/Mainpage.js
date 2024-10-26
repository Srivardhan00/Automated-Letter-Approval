import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import bg from "../images/bg.jpeg";

const Home = () => {
  const HeaderContainer = styled(Box)(({ theme }) => ({
    textAlign: "center",
    color: "black",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // white translucent background
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }));

  const HomeButton = styled(Button)(({ theme }) => ({
    margin: "10px",
    padding: "10px 20px",
    fontSize: "1.2em",
    color: "white",
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "#555",
    },
  }));

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        flexDirection: "column",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <HeaderContainer>
        <Typography
          variant="h1"
          gutterBottom
          style={{ fontFamily: "Georgia", fontSize: "4em", fontWeight: "bold" }}
        >
          Letter Automation
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontFamily: "Georgia", fontStyle: "italic" }}
        >
          Making things faster and smarter
        </Typography>
        <Box display="flex" justifyContent="center">
          <Link to="/login">
            <HomeButton variant="contained">Sign In</HomeButton>
          </Link>
          <Link to="/signup">
            <HomeButton variant="contained">Sign Up</HomeButton>
          </Link>
        </Box>
      </HeaderContainer>
    </Box>
  );
};

export default Home;
