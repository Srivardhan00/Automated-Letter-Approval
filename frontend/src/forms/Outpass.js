import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import outpass from "../images/outpass.jpg";
import Header from "../components/Header";

export default function Outpass() {
  const [formData, setFormData] = React.useState({
    name: "",
    rollNumber: "",
    yearOfStudy: "",
    department: "",
    reason: "",
  });
  const [isSaved, setIsSaved] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://your-backend-api.com/api/outpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSaved(true);
        // Additional logic if needed
      } else {
        console.error("Failed to save the form data");
        // Handle error response
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network error
    }
  };

  const handleDownload = () => {
    // Implement download functionality here
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSend = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@vnrvjiet\.in$/;
    if (emailPattern.test(email)) {
      // Implement email sending functionality here
      setEmailError("");
    } else {
      setEmailError("Please enter a valid example@vnrvjiet.in email.");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: 3,
          backgroundColor: "#D9AFD9",
          backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Card
            sx={{
              maxWidth: "80%",
              margin: 2,
              border: "1px solid black",
              backgroundColor: "purple",
            }}
          >
            <CardMedia
              component="img"
              image={outpass}
              title="Letter example image"
              sx={{ objectFit: "contain", margin: 0 }}
            />
          </Card>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              padding: 2,
              backgroundColor: "#9575cd",
              color: "white",
              width: "100%",
              maxWidth: 600,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ textAlign: "center", marginBottom: 2 }}
              >
                OUTPASS FORM
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                        "& input": {
                          color: "white",
                          background: "#7986cb",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Roll Number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                        "& input": {
                          color: "white",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Year of Study"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                        "& input": {
                          color: "white",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                        "& input": {
                          color: "white",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                        "& input": {
                          color: "white",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #34e89e, #0f3443)",
                      color: "white",
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 600,
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: isSaved ? "purple" : "grey",
                cursor: isSaved ? "pointer" : "not-allowed",
              }}
              disabled={!isSaved}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: 600,
              marginTop: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Enter a mail"
              value={email}
              onChange={handleEmailChange}
              InputLabelProps={{
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  "& input": {
                    color: "white",
                  },
                },
                "& label.Mui-focused": {
                  color: "white",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                marginLeft: 2,
                background: "linear-gradient(to right, #34e89e, #0f3443)",
                width: "20%",
              }}
              onClick={handleSend}
            >
              Send
            </Button>
          </Box>
          {emailError && (
            <Typography variant="body2" sx={{ color: "red", marginTop: 1 }}>
              {emailError}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
