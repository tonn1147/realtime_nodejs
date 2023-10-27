const express = require("express");
const router = express.Router();
const accessTokenHandler = require("../middlewares/accessTokenHandler");
const {login,signup,currentUser} = require("../controllers/userController")

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/current").get(accessTokenHandler,currentUser);

module.exports = router;
