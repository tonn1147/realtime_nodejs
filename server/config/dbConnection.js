const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    
      console.log(
        "database connected: " +
          connect.connection.host +
          "and" +
          connect.connection.name
      );

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
