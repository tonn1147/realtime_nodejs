const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: [true, "this field is mandatory!"],
    },
    email: {
      type: String,
      require: [true, "this field is mandatory!"],
      unique: [true, "this email has already taken"],
    },
    password: {
      type: String,
      require: [true, "this field is mandatory!"],
    },
    role: {
      type: String,
      require: [true, "this field is mandatory!"],
      enum: ["admin", "user"]
    },
    joined_room_id: [{
      type: Schema.Types.ObjectId,
      ref:"Room",
    }],
    topic_id: [{
      type: Schema.Types.ObjectId,
      ref: "Topic"
    }]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
