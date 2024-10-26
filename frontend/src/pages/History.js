import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Header from "../components/Header";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// Mock data for initial history (can be replaced with actual data from backend)
const mockHistory = [
  { id: 1, name: "Outpass Letter", status: "approved" },
  { id: 2, name: "Attendance Letter", status: "approved" },
  { id: 3, name: "Outpass Letter", status: "rejected" },
  { id: 4, name: "Leave Letter", status: "approved" },
];

export default function History() {
  const [history, setHistory] = React.useState(mockHistory);

  // Simulate a backend response for adding a new letter
  React.useEffect(() => {
    // Example of updating status - should be replaced with actual backend polling or WebSocket
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
        {history.map((item) => (
          <Card
            key={item.id}
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

//after connecting to backend

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import Header from "../components/Header";

// export default function History() {
//   const [history, setHistory] = React.useState([]);

//   // Fetch history data from the backend when the component mounts
//   React.useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch("/api/get-history"); // Adjust the endpoint as needed
//         const data = await response.json();
//         setHistory(data);
//       } catch (error) {
//         console.error("Failed to fetch history:", error);
//       }
//     };

//     fetchHistory();
//   }, []);

//   // Simulate a backend response for updating the status of pending letters
//   React.useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await fetch("/api/check-status-updates"); // Adjust the endpoint as needed
//         const updates = await response.json();
//         setHistory((prevHistory) =>
//           prevHistory.map((item) => {
//             const updatedItem = updates.find((update) => update.id === item.id);
//             return updatedItem ? { ...item, status: updatedItem.status } : item;
//           })
//         );
//       } catch (error) {
//         console.error("Failed to update status:", error);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <Header />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: 3,
//           backgroundColor: "#D9AFD9",
//           backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
//           minHeight: "100vh",
//         }}
//       >
//         {history.map((item) => (
//           <Card
//             key={item.id}
//             sx={{
//               width: "80%",
//               margin: 2,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: 2,
//               backgroundColor: "#6200ea",
//               color: "white",
//             }}
//           >
//             <Typography variant="body1">
//               Your letter for {item.name} has been {item.status}
//             </Typography>
//             {item.status === "approved" ? (
//               <Button
//                 variant="contained"
//                 sx={{
//                   background: "linear-gradient(to right, #34e89e, #0f3443)",
//                 }}
//               >
//                 Download
//               </Button>
//             ) : (
//               <Typography variant="body2" sx={{ color: "yellow" }}>
//                 {item.status === "rejected" ? "Rejected" : "Pending"}
//               </Typography>
//             )}
//           </Card>
//         ))}
//         <Button variant="contained" sx={{ marginTop: 2 }}>
//           Load More
//         </Button>
//       </Box>
//     </>
//   );
// }
