const { Topic, Room, Message } = require("../models/conversationModel");

const SocketAction = {
  CREATE_MESSAGE: async function (context, type, user_id, roomId) {
    const message = await Message.create({
      context,
      type,
      user_id,
    });

    const room = await Room.findOne({_id: roomId});
    room.updateOne({},{
        $push: {messages: message}
    })

    return message;
  },
  GET_ALL_MESSAGES: async function (roomId) {
    const room = await Room.findOne({ _id: roomId });
    const sortedMessages = room.messages.sort(
      (a, b) => a.createAt - b.createAt
    );
    return sortedMessages;
  },
};

module.exports = SocketAction;
