let connectDB = async () => {
  if (process.env.USE_FIREBASE === 'true') {
    console.log('USE_FIREBASE=true, skipping MongoDB connect');
    return null;
  }

  // Lazy require to avoid importing mongoose when using Firebase
  const mongoose = await import('mongoose');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
