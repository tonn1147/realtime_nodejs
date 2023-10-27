const ROLE = require("../constants/role")
const canChange = require("../permissions/canChangePermission")

const roleHandler = role => {
    return (req, res, next) => {
        if(req.user.role !== role) res.send(401).json({message: "user is not allowed!"});
        next();
    }
}

const changeRoomAndTopicHandler = (req,res,next) => {
    if(!canChange(req.user,req.object)) res.status(401).json({message: "user is not allowed!"});
    next();
}

module.exports = roleHandler;

