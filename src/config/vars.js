import { readFileSync } from 'fs';

const MONGO_URI_TEST = typeof process.env.MONGO_URI_TEST === 'string' && process.env.MONGO_URI_TEST.length ? process.env.MONGO_URI_TEST : '';
const MONGO_URI = typeof process.env.MONGO_URI === 'string' && process.env.MONGO_URI.length ? process.env.MONGO_URI : '';
const DEFAULT_JWT_EXPIRATION_MINUTES = 60;

const throwRequired = (message) => {
  throw new Error(message);
};

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || throwRequired('private key path');

export const env = process.env.NODE_ENV || 'production';
export const mongo = {
  uri: process.env.NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI,
};
export const jwtSecret = readFileSync(PRIVATE_KEY_PATH).toString('ascii');
export const jwtAlgorithm = process.env.PRIVATE_KEY_ALGORITHM || 'RS256';
export const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES
  || DEFAULT_JWT_EXPIRATION_MINUTES;
export const PUBLIC_USER_FIELDS = ['id', 'name', 'email', 'scopes', 'createdAt'];
