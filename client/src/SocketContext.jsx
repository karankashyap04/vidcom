import React, { useState, useEffect, useRef, createContext } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

export const SocketContext = createContext();

export function ContextProvider({ children }) {
  const [stream, setStream] = useState(null);
  const [mySocketId, setMySocketId] = useState("");
  const [call, setCall] = useState({});
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [username, setUsername] = useState("");

  const myVideo = useRef();
  const otherVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream); // setting video stream state
        myVideo.current.srcObject = stream; // setting reload-persistant video stream (ref)
      });

    socket.on("YOU_CONNECTED", (socketId) => {
      setMySocketId(socketId);
    });

    socket.on("RECEIVE_CALL", (data) => {
      console.log("received a call message");
      const { from, callerName, signalData } = data;
      setCall({
        from: from,
        callerName: callerName,
        signalData: signalData,
        receivingCall: true,
      });
    });
  }, []);

  function answerCall() {
    setIsCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });

    peer.on("signal", (data) => {
      socket.emit("ANSWER_CALL", { signal: data, to: call.from });
    });

    peer.on("stream", (stream) => {
      otherVideo.current.srcObject = stream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  }

  function makeCall(id) {
    console.log("make call");
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on("signal", (data) => {
      console.log("going to emit");
      socket.emit("MAKE_CALL", {
        from: mySocketId,
        userToCall: id,
        signalData: data,
        callerName: username,
      });
    });

    peer.on("stream", (stream) => {
      otherVideo.current.srcObject = stream;
    });

    socket.on("ANSWER_CALL", (signal) => {
      setIsCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  function leaveCall() {
    connectionRef.current.destroy(); // stop receiving video and audio input from camera
    setIsCallEnded(true);
    window.location.reload();
  }

  return (
    <SocketContext.Provider
      value={{
        stream,
        mySocketId,
        call,
        isCallAccepted,
        isCallEnded,
        username,
        setUsername,
        myVideo,
        otherVideo,
        answerCall,
        makeCall,
        leaveCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
