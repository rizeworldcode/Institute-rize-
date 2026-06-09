const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

exports.connectDB = async () => {
  try {
    // Production-grade connection options
    const options = {
      maxPoolSize: 100, // Maintain up to 100 socket connections
      minPoolSize: 10,  // Maintain at least 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.mongo_URI, options);
    
    if (conn) {
        console.log(`Database connected successfully: ${conn.connection.host}`);
    } else {
        console.log("Database connection failed!");
    }
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

  } catch (error) {
    console.log("Database connection failed! ", error);
    process.exit(1); // Exit if DB connection fails in production
  }
};
