const asyncHandler = require("express-async-handler");
const { Topic, Room, Message } = require("../models/conversationModel");
const User = require("../models/userModel")
const { findOneAndUpdate, findById } = require("../models/userModel");

//img upload
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, '../uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

// topic controller
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.where("owner_id").ne(req.user.user_id);

  const context = {
    topics: topics,
  };

  res.status(200).json(context);
});

const getTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({_id: req.query.id});

  if (!topic) {
    res.status(400);
    throw new Error("Topic not found!");
  }

  const context = {
    topic: topic,
  };
  res.status(200).json(context);
});

const createTopic = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const lowerCaseName = name.toLowerCase();
  const context = {};
  if (!name) {
    res.status(400);
    throw new Error("Missing name field");
  }
  if (await Topic.findOne({ name: lowerCaseName })) {
    res.status(400);
    throw new Error("this topic has already existed in database");
  }

  const topic = await Topic.create({
    name: lowerCaseName,
    owner_id: req.user._id,
  });
  if (!topic) {
    res.status(400);
    throw new Error("Failed to create !");
  }

  context.topic = topic;
  res.status(200).json(context);
});

const updateTopic = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const context = {};

  if (!name) {
    res.status(400);
    throw new Error("Missing name field");
  }

  const topic = await Topic.findById((id = req.params.id));
  if (!topic) {
    res.status(400);
    throw new Error("Failed to update !");
  }
  if (topic.user_id.toString() !== req.user._id) {
    res.status(403);
    throw new Error("unauthorized to update");
  }

  context.topic = await topic.updateOne(name);
  res.status(200).json(context);
});

const deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById((id = req.params.id));

  if (!topic) {
    res.status(400);
    throw new Error("Topic not found !");
  }
  if (topic.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("Unauthorized to delete !");
  }

  await Topic.deleteOne({_id: req.params.id});

  const context = {
    topic: topic,
  };
  res.status(200).json(context);
});

// room controller
const getRooms = asyncHandler(async (req, res) => {
  const user = await User.findById({_id: req.user._id});
  const rooms = await Room.find({_id: {$nin: user.joined_room_id}}).exec((err,rooms) => {
    if(err) {
      res.status(500);
      throw new Error(err);
    }

    const context = {
      rooms: rooms,
    };
    res.status(200).json(context);
  });

  
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({_id: req.params.id});

  if (!room) {
    res.status(400);
    throw new Error("Room not found!");
  }

  const context = {
    room: room,
  };
  res.status(200).json(context);
});

const getRoomsByTopic = asyncHandler(async (req,res) => {
  const topicName = req.query.topic;
  const existingTopic = await Topic.findOne({name: topicName});
  if(!existingTopic) {
    res.status(400);
    throw Error("Topic not found");
  }

  const rooms = await Room.find({topic_id: existingTopic._id});
  const context = {
    rooms: rooms
  }
  response.status(200).json(context);
})

const createRoom = asyncHandler(async (req, res) => {
  const { name, description, topicName} = req.body;
  console.log(name,description,topicName);
  const context = {};

  if (!name || !description || !topicName) {
    res.status(400);
    throw new Error("Missing fields");
  }

  const existingTopic = await Topic.findOne({name: {$regex: topicName, $options: "i"}});
  if(!existingTopic) {
    req.status(400)
    throw new Error("Topic not Found!");
  }

  const room = await Room.create({
    owner_id: req.user._id,
    name: name,
    description: description,
    participant_id: [req.user._id],
    topic_id: [existingTopic._id]
  });

  existingTopic.updateOne({
    $push: {room_id: room._id}
  });

  if (!room) {
    res.status(400);
    throw new Error("Failed to create !");
  }

  context.room = room;

  res.status(200).json(room);
});

const joinRoom = asyncHandler(async (req,res) => {
  const user = User.findById(req.user._id);
  const room = Room.findOne({name: req.query.name , });


  room.updateOne({$push: {participant_id: req.user.__id}})
  
  const context = {
    room: room
  }
  res.status(200).json(context);
})

const updateRoom = asyncHandler(async (req, res) => {});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById((id = req.params.id));
  if (!room) {
    res.status(400);
    throw new Error("failed to delete");
  }

  const context = {
    room: room,
  };
  res.status(200).json(context);
});

//message Controller
const getMessagesByRoomId = asyncHandler(async (req, res) => {
  const roomId = req.query.id;
  let context = {};
  if(!roomId) {
    res.json(400);
    throw new Error("room id is mandatory!");
  }

  const room = Room.findOne({_id: roomId});
  if(!room) {
    res.json(404);
    throw new Error("room not found!");
  }

  const messages = room.messages;
  context.messages = messages;
  res.status(200).json(context);
});

const getMessage = asyncHandler(async (req, res) => {
  const messageId = req.query.id;
  const message = Message.findOne({_id: messageId});

  if(!message) {
    res.status(400);
    throw new Error("Message not found");
  }

  res.status(200).json(message);
});

const createMessage = asyncHandler(async (req, res) => {
  let context = {};
  const messageContext = req.body.message;
  const type = req.body.type || 'text';

  const message = Message.create({
    context: messageContext,
    type: type,
    user_id: req.user._id,
  });
  context.message = message;
  res.status(200).json(context);
});

const updateMessage = asyncHandler(async (req, res) => {});

const deleteMessage = asyncHandler(async (req, res) => {});

//search
const search = asyncHandler(async (req,res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = 10;
  const search = req.query.search;
  const type = req.query.type || "room";

  let result = null;
  switch (type) {
    case "topic":
      result = await Topic.find({name: {$regex: search,$options: 'i'}}).skip(limit * page).limit(limit);
      break;
    case "room":
      result = await Room.find({name: {$regex: search,$options: 'i'}}).skip(limit * page).limit(limit);
      break;
    default:
      res.status(400);
      throw new Error("query non-existed!");
  }

  const context = {
    message: "successful!",
    result: result,
  }
  res.status(200).json(context);
})

module.exports = {
  getMessagesByRoomId,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getRooms,
  getRoom,
  getRoomsByTopic,
  createRoom,
  updateRoom,
  deleteRoom,
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  search,
};
