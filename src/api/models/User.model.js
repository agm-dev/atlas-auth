import { Schema, model } from 'mongoose';
// import httpStatus from 'http-status';
// import bcrypt from 'bcryptjs';
// import jwt from 'jwt-simple';
// import uuidv4 from 'uuid/v4';
// const APIError = require('../utils/APIError')
// const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars')
import { ALL_SCOPES } from '../../config/scopes';

const scopeSchema = new Schema({
  type: String,
  enum: ALL_SCOPES,
});

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 256,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  scopes: [scopeSchema],
}, {
  timestamps: true,
});

// I don't understand why export default doesn't work here (breaks unit test)
module.exports = model('User', userSchema);
