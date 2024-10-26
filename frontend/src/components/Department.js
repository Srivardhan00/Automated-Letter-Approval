import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Department = ({ value, onChange, error }) => {
  const departments = [
    "AIML",
    "IOT",
    "AIDS",
    "CYS",
    "DS",
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "EIE",
    "ME",
    "CE",
    "AE",
  ];

  return (
    <Grid item xs={12}>
      <FormControl fullWidth error={!!error}>
        <InputLabel id="department-label">Department</InputLabel>
        <Select
          labelId="department-label"
          id="department"
          value={value}
          onChange={onChange}
          label="Department"
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
        >
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <Typography variant="body2" color="error">
            {error.message}
          </Typography>
        )}
      </FormControl>
    </Grid>
  );
};

export default Department;
