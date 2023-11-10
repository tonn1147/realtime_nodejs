const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

//middleware
const errHandler = require("./middlewares/errorHandler");

// socket Action
const SocketAction = require("./actions/socketAction");

// create server
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Change this to your desired origin or set it to allow only specific origins
    methods: ["GET", "POST"],
  },
});

//db connect
const connectDB = require("./config/dbConnection");
connectDB();

const port = process.env.PORT || 3000;

//
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("./uploads", express.static("uploads"));
if (process.env.ENV === "LOCAL") {
  app.use(morgan("combined"));
}

//routing
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chat", require("./routes/conversationRoute"));
app.use(errHandler);

//socket io
io.on("connection", (socket) => {
  let currentRoomId = null;

  socket.on("get-all-message", async (roomId) => {
    console.log(roomId);
    currentRoomId = roomId;
    const messages = await SocketAction.GET_ALL_MESSAGES(currentRoomId);
    socket.to(currentRoomId).emit("return-all-message", messages);
  });

  socket.on("join-room", () => {
    socket.join(currentRoomId);
  });

  socket.on("sending-message", async (context, userId, type) => {
    const message = SocketAction.CREATE_MESSAGE(context, type, userId,roomId);
    socket.emit("receiving-message", message);
    socket.to(currentRoomId).emit("receiving-message", message);
  });

  socket.on("disconnect", (socket) => {
    io.broadcast.emit("user-left");
  });
});

server.listen(port, () => {
  console.log(`server is running on 'http://localhost:${port}/'`);
});
