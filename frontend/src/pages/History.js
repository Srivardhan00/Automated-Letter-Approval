import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Header from "../components/Header";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import axios from "axios";
import { toast } from "react-toastify";

export default function History() {
  const [history, setHistory] = React.useState([]);

  // Fetch history data from the backend when the component mounts
  const fetchHistory = async () => {
    try {
      const fetchedHistory = await axios.get(
        "http://localhost:8000/letter/getHistory",
        { withCredentials: true }
      );
      setHistory(fetchedHistory.data); // Ensure to set the data properly
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Unexpected error occurred"
      );
    }
  };

  // Using useEffect to fetch history on component mount
  React.useEffect(() => {
    fetchHistory();
  }, []); // Empty dependency array means it runs once when the component mounts

  // Simulate a backend response for updating the status of pending letters
  React.useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prevHistory) => {
        const updatedHistory = prevHistory.map((item) =>
          item.status === "pending" ? { ...item, status: "approved" } : item
        );
        return updatedHistory;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          backgroundColor: "#D9AFD9",
          backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          minHeight: "100vh",
        }}
      >
        {history?.map((item) => (
          <Card
            key={item.id} // Ensure each key is unique
            sx={{
              width: "80%",
              margin: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#607d8b",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {item.status === "approved" ? (
                <CheckCircleIcon sx={{ color: "#7cb342" }} />
              ) : item.status === "rejected" ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <HourglassEmptyIcon sx={{ color: "yellow" }} />
              )}
              <Typography variant="body1">
                Your letter for {item.name} has been {item.status}
              </Typography>
            </Box>
            {item.status === "approved" ? (
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #34e89e, #0f3443)",
                }}
              >
                Download
              </Button>
            ) : item.status === "pending" ? (
              <Typography variant="body2" sx={{ color: "yellow" }}>
                Pending
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "#d50000", fontSize: "20px" }}
              >
                Rejected
              </Typography>
            )}
          </Card>
        ))}
        <Button variant="contained" sx={{ marginTop: 2 }}>
          Load More
        </Button>
      </Box>
    </>
  );
}
