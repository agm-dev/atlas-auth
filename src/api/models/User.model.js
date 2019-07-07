import mongoose, { Schema, model } from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import APIError from '../utils/APIError';
import {
  env,
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

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
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

userSchema.statics = {
  async get(id) {
    try {
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      const nowUnix = Math.round((new Date()).getTime() / 1000); // current time in seconds
      if (nowUnix >= refreshObject.expires) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: ['email'],
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

// I don't understand why export default doesn't work here (breaks unit test)
module.exports = model('User', userSchema);
