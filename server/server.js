const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const { Topic, Room, Message } = require("./models/conversationModel");

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

//set up swagger
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Realtime chat app with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Tonn",
        email: "trantonanh2003@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(specs, { explorer: true })
);

//routing
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chat", require("./routes/conversationRoute"));
app.use(errHandler);

//socket io
io.on("connection", (socket) => {
  socket.on("get-all-message", (roomId) => {
    console.log("get sth");
    Room.find({ _id: roomId }).populate("messages").exec((err,doc)=> {
      if (err) console.log(err);
      console.log("get sth");
      socket.to(roomId).emit("return-all-message", doc.messages);
    });
  });

  socket.on("join-room", (currentRoomId) => {
    console.log(currentRoomId);
    socket.join(currentRoomId);
  });

  socket.on("sending-message", (context, userId, type, roomId) => {
    // my best attempt to work with mongoose without using async await 
    // because the code was broken when i used it, dont know why yet.
    const message = new Message({
      context,
      type,
      user_id: userId,
    });
    message.save().then((messageDoc) => {
      console.log("save");
      Room.findOne({ _id: roomId }).then((roomDoc) => {
          console.log("save" + messageDoc.context);
          if(roomDoc.messages) {
            return roomDoc.updateOne(
              {
                $push: { messages: messageDoc },
              }
            );
          }else {
            return roomDoc.updateOne({messages: [messageDoc]})
          }
      }).then((updateResult) => {
        console.log("save" + messageDoc.context);
        socket.emit("receiving-message", messageDoc);
      }).catch(err => {
        console.log(err);
      });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left");
  });
});

server.listen(port, () => {
  console.log(`server is running on 'http://localhost:${port}/'`);
});
