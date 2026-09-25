const JoinRequest = require('../models/JoinRequest');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.createJoinRequest = async (req, res) => {
  try {
    const { name, phone, reason } = req.body;
    const user = req.user ? req.user._id : undefined;
    const joinRequest = await JoinRequest.create({ name, phone, reason, user });
    return successResponse(res, 201, 'Join request submitted successfully', joinRequest);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};
