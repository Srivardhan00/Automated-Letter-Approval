import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const itemData = [
  {
    img: "/images/outpass.jpg",
    title: "Outpass",
    link: "/outpass",
  },
  {
    img: "/images/attendance.jpg",
    title: "Attendance",
    link: "/attendance",
  },
  {
    img: "/images/internship.jpg",
    title: "LOC for Internship",
    link: "/internship",
  },
  {
    img: "/images/bonafide.jpg",
    title: "Bonafide",
    link: "/bonafide",
  },
  {
    img: "/images/outpass.jpg",
    title: "Homepass",
    link: "/homepass",
  },
  {
    img: "https://www.allbusinesstemplates.com/thumbs/73bebdff-8f02-4544-827e-2cdd8c451d56_1.png",
    title: "To conduct event",
    link: "/to-conduct-event",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Typography variant="h4" component="div">
          Templates
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={6} justifyContent="center">
          {itemData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.img}>
              <Link
                to={item.link}
                style={{ textDecoration: "none", display: "block" }}
              >
                <Card
                  sx={{
                    maxWidth: 300,
                    margin: "auto",
                    border: "1px solid black",
                    backgroundColor: "black",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CardMedia
                    sx={{ height: 160 }}
                    image={item.img}
                    title={item.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
