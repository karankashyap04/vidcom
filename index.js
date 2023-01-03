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