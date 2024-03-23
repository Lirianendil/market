import * as dotenv from 'dotenv';
import * as process from "process";

dotenv.config();

// App
export const APPLICATION_LISTEN_PORT = process.env.APPLICATION_LISTEN_PORT || 5000;
// Mongo
export const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://akenum2:athelstan277@onlineshop.wg6mr1w.mongodb.net/onlineShop?retryWrites=true&w=majority';

//Auth JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'afka;lkfakewr';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const BCRYPT_HASH_ROUNDS = 10;

// Errors
export const INTERNAL_ERROR = 'Internal server error';
export const INVALID_CREDENTIALS = 'Invalid credentials';

