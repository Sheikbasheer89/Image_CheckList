import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
  const [vertical, setvertical] = React.useState("bottom");
  const [horizontal, sethorizontal] = React.useState("right");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    props.setOpenMsg(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={props.openMsg}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", fontSize: "13px" }}
        >
          This document is recognized as {props.DocCheck} and it moved to{" "}
          {props.DocCheck} section!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
