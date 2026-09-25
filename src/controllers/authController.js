const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, instagramUsername } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return errorResponse(res, 400, 'User already exists');

    const user = await User.create({ name, email, phone, password, instagramUsername });
    if (user) {
      return successResponse(res, 201, 'User registered successfully', {
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    }
    return errorResponse(res, 400, 'Invalid user data');
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return successResponse(res, 200, 'Login successful', {
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    }
    return errorResponse(res, 401, 'Invalid email or password');
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};

exports.getMe = async (req, res) => {
  return successResponse(res, 200, 'User details fetched', req.user);
};
