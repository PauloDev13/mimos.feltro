import mongoose, { Mongoose } from 'mongoose';
import { IProduct } from '../interfaces/IProduct';

type connectedType = {
  isConnected: number | boolean;
};

interface IDatabaseMongo {
  connect: () => Promise<void>;
  disconnected: () => Promise<void>;
  convertDocToObj: (doc?: any) => IProduct;
}

const connection: connectedType = {
  isConnected: 0,
};

const connect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log('Already connected');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('Use previous connection');
      return;
    }
    await mongoose.disconnect();
  }

  const db: Mongoose = await mongoose.connect(process.env.MONGODB_URI || '', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('New connection');
  connection.isConnected = db.connections[0].readyState;
};

const disconnected = async (): Promise<void> => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
};

function convertDocToObj(doc?: any): IProduct {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db: IDatabaseMongo = { connect, disconnected, convertDocToObj };
export default db;