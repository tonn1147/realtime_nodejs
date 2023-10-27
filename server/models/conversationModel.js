const mongoose = require("mongoose");
const { schema } = require("./userModel");
const Schema = mongoose.Schema;

//topic
const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "this field is mandatory"],
      unique: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    room_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  {
    timestamp: true,
  }
);

topicSchema.pre("delete", async (next) => {
  await Room.deleteMany({ topic_id: this._id });
  next();
});

topicSchema.pre("save", async (next) => {
  this.name = this.name.toLowerCase();

  next();
})

//message
const messageSchema = new Schema(
  {
    context: String,
    type: {
      type: String,
      enum: ["text", "image"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamp: true,
  }
);

//room
const roomSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      require: [true, "this field is mandatory !"],
      unique: [true, "this name is already taken"],
    },
    description: {
      type: String,
      required: [true, "this field is mandatory !"],
    },
    topic_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    participant_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    messages: [messageSchema],
  },
  {
    timestamp: true,
  }
);

roomSchema.pre("delete", async (next) => {
  await Message.deleteMany({ room_id: this._id });

  next();
});

const Topic = mongoose.model("Topic", topicSchema);
const Room = mongoose.model("Room", roomSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Topic,
  Room,
  Message,
};
