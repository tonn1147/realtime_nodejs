const express = require("express");
const router = express.Router();
const accessTokenHandler = require("../middlewares/accessTokenHandler");
const conversationController = require("../controllers/conversationController")

router.use(accessTokenHandler);

//search route
router.route('/search').get(conversationController.search);

//room routes
router.route('/rooms').get(conversationController.getRooms);
router.route('/getRoomsByTopic').get(conversationController.getRoomsByTopic);
router.route('/room').post(conversationController.createRoom);
router.route('/room').get(conversationController.getRoom).put(conversationController.createRoom).delete(conversationController.deleteRoom);

//topic routes
router.route('/topics').get(conversationController.getTopics);
router.route('/topic').post(conversationController.createTopic);
router.route('/topic').get(conversationController.getTopic).put(conversationController.createTopic).delete(conversationController.deleteTopic);

//message.routes
router.route('/messages').get(conversationController.getMessagesByRoomId);
router.route('/message').get(conversationController.getMessage).put(conversationController.createMessage).delete(conversationController.deleteMessage);

module.exports = router;