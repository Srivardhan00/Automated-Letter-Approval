import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Status() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center" mt={40}>
        <Button variant="contained" onClick={handleClickOpen}>
          LETTER STATUS
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
      >
        <DialogActions
          style={{ justifyContent: "center", gap: "100px", margin: "100px" }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ backgroundColor: "green" }}
          >
            APPROVE
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ backgroundColor: "red" }}
          >
            REJECT
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
