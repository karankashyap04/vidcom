import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { Phone } from "@material-ui/icons";
import { SocketContext } from "../SocketContext";

export default function Notifications() {
  const { answerCall, isCallAccepted, call } = useContext(SocketContext);
  console.log("isCallAccpeted: " + isCallAccepted);
  console.log("call.receivingCall: " + call.receivingCall);
  return (
    <div>
      {!isCallAccepted && call.receivingCall ? (
        <div>
          <h2>Incoming call from {call.callerName}</h2>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Phone fontSize="large" />}
            onClick={() => {
              answerCall();
            }}
          >
            Answer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
