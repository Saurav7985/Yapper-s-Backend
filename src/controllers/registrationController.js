const Registration = require('../models/Registration');
const Meetup = require('../models/Meetup');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.createRegistration = async (req, res) => {
  try {
    const { meetupId, name, phone, email } = req.body;
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) return errorResponse(res, 404, 'Meetup not found');
    if (meetup.status !== 'upcoming') return errorResponse(res, 400, 'Meetup is not upcoming');
    if (meetup.registeredCount >= meetup.capacity) return errorResponse(res, 400, 'Meetup is full');

    const exists = await Registration.findOne({ meetup: meetupId, user: req.user._id });
    if (exists) return errorResponse(res, 400, 'Already registered');

    const registration = await Registration.create({ meetup: meetupId, user: req.user._id, name, phone, email });
    meetup.registeredCount += 1;
    await meetup.save();

    return successResponse(res, 201, 'Registration successful', registration);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};
