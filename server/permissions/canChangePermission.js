const ROLE = require("../constants/role");
const User = require("../models/userModel");

const canChange = (user,object) => {
    return (
        user.role === ROLE.admin || user._id === object.owner_id
    )
}

module.exports = canChange;