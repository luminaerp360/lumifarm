import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        retryAttempts: Number.MAX_SAFE_INTEGER,
        retryDelay: 10000,
        connectionFactory: (connection) => {
          connection.on('disconnected', () => {
            console.info('MongoDB disconnected! Attempting to reconnect...');
          });
          connection.on('error', (error) => {
            console.error('MongoDB connection error:', error.message);
          });
          connection.on('connected', () => {
            console.info('MongoDB connected successfully');
          });
          return connection;
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
