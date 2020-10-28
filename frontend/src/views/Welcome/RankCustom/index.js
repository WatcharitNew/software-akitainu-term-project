import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  Box,
} from "@material-ui/core";
import Button from "components/Button";
import CloseIcon from "@material-ui/icons/Close";
import PetsIcon from "@material-ui/icons/Pets";
import Pet from "../../../pets.jpg";

const usestyle = makeStyles((theme) => ({
  root: {
    height: "600px",
    backgroundColor: "#465A74",
    padding: "30px",
  },
  Button: {
    // height: "128px",
    // maxHeight: "128px",
    padding: "50px 0px 50px 0px",
    position: "center",
  },
}));

function RankDialog({ open, onClose, time, settime }) {
  const classes = usestyle();
  // console.log("open",open)

  React.useEffect(() => {
    if (open) {
      setTimeout(() => settime(time + 1), 1000);
    }
    console.log("open", open);
  }, [time, open]);

  const handleClose = () => {
    settime(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"lg"}>
      <Grid container className={classes.root}>
        <CloseIcon
          style={{
            position: "absolute",
            top: "16px",
            right: "24px",
            width: "30px",
            height: "30px",
            color: "#FFF",
            cursor: "pointer",
          }}
          onClick={handleClose}
        ></CloseIcon>
        {/* <PetsIcon
                    style={{
                        position: "absolute",
                        top: "28%",
                        right: "38%",
                        width: "300px",
                        height: "300px",
                        color: "#DADADA",
                    }}
                ></PetsIcon> */}
        <Grid
          container
          style={{
            position: "absolute",
            top: "56%",
            left: "45%",
            textAlign: "center",
            width: "200px",
            // backgroundImage:`url(${Pet})`
          }}
        >
          {/* <img src={Pet}></img> */}
          <Typography
            style={{
              color: "#FFF",
              fontSize: "48px",
              textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {time}
          </Typography>
        </Grid>
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography
            style={{
              color: "#fff",
              fontSize: "48px",
              textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Waiting Time
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default RankDialog;