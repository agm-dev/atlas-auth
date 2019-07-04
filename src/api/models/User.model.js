import { Schema, model } from 'mongoose';
// import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
// import uuidv4 from 'uuid/v4';
// const APIError = require('../utils/APIError')
import {
  jwtSecret,
  jwtExpirationInterval,
  jwtAlgorithm,
  PUBLIC_USER_FIELDS,
} from '../../config/vars';
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

userSchema.method({
  transform() {
    const fieldsReducer = (result, field) => Object.assign({}, result, { [field]: this[field] });
    return PUBLIC_USER_FIELDS.reduce(fieldsReducer, {});
  },

  token() {
    const nowUnix = Math.round((new Date()).getTime() / 1000); // current time in seconds
    const payload = {
      exp: nowUnix + (jwtExpirationInterval * 60),
      iat: nowUnix,
      // eslint-disable-next-line no-underscore-dangle
      sub: this._id,
      email: this.email,
      name: this.name,
      scopes: this.scopes,
    };
    return jwt.encode(payload, jwtSecret, jwtAlgorithm);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});


// I don't understand why export default doesn't work here (breaks unit test)
module.exports = model('User', userSchema);
