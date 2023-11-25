import express from "express";
import { Server } from "socket.io";

import cors from "cors";
const app = express();
app.use(cors());
const server = app.listen(3001, () => console.log("Listening on port 3001"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  // send welcome message to the client
  socket.emit("chat message", {
    username: "System",
    message: "Welcome to the chat!",
  });

  // send message to all clients except the one who sent the message
  socket.broadcast.emit("chat message", {
    username: "System",
    message: "A new user has joined the chat!",
  });

  // listen for messages from the client
  socket.on("chat message", (message) => {
    console.log("New message from client: ", message.username, message.message);
    // send message to all clients
    io.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // send message to all clients
    io.emit("chat message", {
      username: "System",
      message: "A user has left the chat!",
    });
  });
});
