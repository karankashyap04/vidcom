import React, { useContext } from "react";
import { Typography, Paper } from "@material-ui/core";
import "../styles/Video.css";
import { SocketContext } from "../SocketContext";

export default function Video() {
  const {
    myVideo,
    otherVideo,
    username,
    stream,
    call,
    isCallAccepted,
    isCallEnded,
  } = useContext(SocketContext);
  return (
    <div className="container">
      <div className="row display-row">
        {stream ? (
          <VideoDisplay videoRef={myVideo} isMuted={true} username={username} />
        ) : null}
        {isCallAccepted && !isCallEnded ? (
          <VideoDisplay
            videoRef={otherVideo}
            isMuted={false}
            username={call.callerName}
          />
        ) : null}
      </div>
    </div>
  );
}

function VideoDisplay({ videoRef, isMuted, username }) {
  return (
    <div className="col col-lg-6 col-md-6 col-sm-12 display">
      <Paper className="video-container">
        <Typography variant="h5" gutterBottom>
          {username || "Name"}
        </Typography>
        {isMuted ? (
          <video ref={videoRef} playsInline autoPlay className="video" muted />
        ) : (
          <video ref={videoRef} playsInline autoPlay className="video" />
        )}
      </Paper>
    </div>
  );
}
