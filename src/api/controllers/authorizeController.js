import httpStatus from 'http-status';

const User = require('../models/User.model');

export default async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (err) {
    next(err); // TODO: use User method to return transformed error
  }
};
