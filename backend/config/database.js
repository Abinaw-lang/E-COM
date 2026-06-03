import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Warning: MongoDB connection failed: ${error.message}`);
    console.log('Server running in offline mode - database operations will fail');
    // Don't exit, allow server to run for development/testing
  }
};

export default connectDB;
