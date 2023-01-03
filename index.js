const express = require("express");
const app = express();
const server = require("http").createServer(app);

const cors = require("cors"); // middleware for cross-origin requests

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running on port " + PORT);
});

io.on("connection", (socket) => {
  socket.emit("YOU_CONNECTED", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("CALL_ENDED");
  });

  socket.on("MAKE_CALL", (data) => {
    const { userToCall, from, callerName, signalData } = data;
    io.to(userToCall).emit("RECEIVE_CALL", {
      signalData: signalData,
      from: from,
      callerName: callerName,
    });
  });

  socket.on("ANSWER_CALL", (data) => {
    const { to, signalData } = data;
    io.to(to).emit("ANSWERED_CALL", signalData);
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
