import React from "react";
import Box from "@mui/material/Box";
import error from "../images/error.jpg";

const Error = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${error})`,
        backgroundSize: "cover",
        //backgroundRepeat: "no-repeat",
        //backgroundPosition: "center",
      }}
    ></Box>
  );
};

export default Error;
