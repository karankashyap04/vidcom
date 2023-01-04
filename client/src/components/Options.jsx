import React, { useState, useContext } from "react";
import { Typography, TextField, Button, Paper } from "@material-ui/core";
import { Phone, PhoneDisabled, Assignment } from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../SocketContext";
import "../styles/Options.css";

export default function Options({ children }) {
  const {
    mySocketId,
    username,
    setUsername,
    isCallAccepted,
    isCallEnded,
    makeCall,
    leaveCall,
  } = useContext(SocketContext);
  const [callRecipientId, setCallRecipientId] = useState("");
  return (
    <div className="container options-container">
      <Paper className="options-paper" elevation={10}>
        <form className="options-form" autoComplete="off" noValidate>
          <div className="row">
            <div className="col col-lg-6 col-md-6 col-sm-6">
              <Typography variant="h6" gutterBottom>
                User Info
              </Typography>
              <TextField
                label="Username"
                value={username}
                fullWidth
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <CopyToClipboard text={mySocketId} className="copy-id">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                  className="options-button"
                >
                  Copy your ID
                </Button>
              </CopyToClipboard>
            </div>
            <div className="col col-lg-6 col-md-6 col-sm-12">
              <Typography variant="h6" gutterBottom>
                Call Another User
              </Typography>
              <TextField
                label="ID to Call"
                value={callRecipientId}
                fullWidth
                onChange={(e) => {
                  setCallRecipientId(e.target.value);
                }}
              />
              {isCallAccepted && !isCallEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<PhoneDisabled fontSize="large" />}
                  onClick={() => {
                    leaveCall();
                  }}
                  className="options-button"
                >
                  Leave Call
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Phone fontSize="large" />}
                  onClick={() => {
                    console.log("Button clicked");
                    makeCall(callRecipientId);
                  }}
                  className="options-button"
                >
                  Call
                </Button>
              )}
            </div>
          </div>
        </form>
        {children}
      </Paper>
    </div>
  );
}
