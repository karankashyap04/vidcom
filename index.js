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
    const { userToCall, from, name, signalData } = data;
    io.to(userToCall).emit("RECEIVE_CALL", {
      signalData: signalData,
      from: from,
      name: name,
    });
  });

  socket.on("ANSWER_CALL", (data) => {
    const { to, signal } = data;
    io.to(data.to).emit("ANSWERED_CALL", signal);
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
