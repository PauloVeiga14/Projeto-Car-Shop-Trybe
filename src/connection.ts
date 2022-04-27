import mongoose from 'mongoose';

// Ao realizar o teste, comente a linha 5 e descomente a 6.

const MONGO_DB_URL = 'mongodb://localhost:27017/CarShop';
// const MONGO_DB_URL = 'mongodb://mongodb:27017/CarShop';

const connectToDatabase = (
  mongoDatabaseURI = process.env.MONGO_URI
    || MONGO_DB_URL,
) => mongoose.connect(mongoDatabaseURI);

export default connectToDatabase;
