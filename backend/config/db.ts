import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URL;
  if (!mongoURI) {
    console.error('FATAL: MONGODB_URI or MONGODB_URL is not defined.');
    process.exit(1);
  }

  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      retries--;
      console.error(`MongoDB connection failed. Retries left: ${retries}`, error instanceof Error ? error.message : error);
      if (retries === 0) {
        console.error('FATAL: Could not connect to MongoDB after 5 attempts.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000)); // Wait 5s before retrying
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected.');
};
