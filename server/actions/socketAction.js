const { Topic, Room, Message } = require("../models/conversationModel");

const SocketAction = {
    CREATE_MESSAGE: async function (context,type) {
        const message = await Message.create({
            context,
            type,
        })
    }
}