const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

//middleware
const errHandler = require("./middlewares/errorHandler");

// create server
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // Change this to your desired origin or set it to allow only specific origins
    methods: ['GET', 'POST'],
  },
});

//db connect
const connectDB = require("./config/dbConnection");
connectDB();

const port = process.env.PORT || 3000;

//
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("./uploads", express.static("uploads"))
if(process.env.ENV === "LOCAL") {
  app.use(morgan('combined'));
}

//routing
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chat", require("./routes/conversationRoute"));
app.use(errHandler);

//socket io
io.on("connection", (socket) => {
  console.log(`${socket.id} has been in!`);

  socket.on("get-all-message", (roomId) => {
    console.log(roomId);
    // retrieve messages
    socket.emit("return-all-message", rooms);
  })

  socket.on("sending-message", (message) => {
    console.log("message received:" + message);
    socket.emit("receiving-message", message);
    socket.broadcast.emit("receiving-message",message);
  })

  socket.on("disconnect", (socket) =>{
    io.broadcast.emit("user-left");
  })
});

server.listen(port, () => {
  console.log(`server is running on 'http://localhost:${port}/'`);
});