const Moment = require('../models/Moment');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getMoments = async (req, res) => {
  try {
    const moments = await Moment.find({ isPublished: true }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Moments fetched successfully', moments);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};
