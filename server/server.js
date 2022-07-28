const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    if (io.sockets.adapter.rooms.get(data.room).size === 3) {
      console.log(`Room is full for ${socket.id}`);
      socket.to(socket.id).emit("full_room", data.room);
      socket.leave(data.room);
      return;
    }
    console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    console.log(
      `There are ${
        io.sockets.adapter.rooms.get(data.room).size
      } users in the room`
    );
    if (io.sockets.adapter.rooms.get(data.room).size === 2) {
      const roomIds = [...io.sockets.adapter.rooms.get(data.room)];
      socket
        .to(data.room)
        .emit("game_start", { oppName: data.name, roomIds, first: true });
    }
  });

  socket.on("find_opponent", (data) => {
    socket.to(data.oppId).emit("game_start", {
      oppName: data.username,
      roomIds: data.roomIds,
      first: false,
    });
  });

  socket.on("send_move", (data) => {
    socket.to(data.opponentId).emit("receive_move", data.move);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("SERVER RUNNING");
});
