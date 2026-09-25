const Meetup = require('../models/Meetup');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getMeetups = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.featured) query.isFeatured = req.query.featured === 'true';
    
    const meetups = await Meetup.find(query).sort({ date: 1 });
    return successResponse(res, 200, 'Meetups fetched successfully', meetups);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};

exports.getMeetupById = async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) return errorResponse(res, 404, 'Meetup not found');
    return successResponse(res, 200, 'Meetup fetched successfully', meetup);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};

exports.createMeetup = async (req, res) => {
  try {
    const { title, description, category, imageUrl, date, startTime, endTime, location, address, capacity, isFeatured } = req.body;
    
    if (!imageUrl || imageUrl.trim() === '') {
      return errorResponse(res, 400, 'Image URL is required');
    }

    const meetup = await Meetup.create({
      title, description, category, imageUrl, date, startTime, endTime, location, address, capacity, isFeatured
    });
    return successResponse(res, 201, 'Meetup created successfully', meetup);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};

exports.updateMeetup = async (req, res) => {
  try {
    const { title, description, category, imageUrl, date, startTime, endTime, location, address, capacity, isFeatured } = req.body;
    
    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) return errorResponse(res, 404, 'Meetup not found');

    if (imageUrl) meetup.imageUrl = imageUrl.trim();
    if (title) meetup.title = title;
    if (description) meetup.description = description;
    if (category) meetup.category = category;
    if (date) meetup.date = date;
    if (startTime) meetup.startTime = startTime;
    if (endTime) meetup.endTime = endTime;
    if (location) meetup.location = location;
    if (address) meetup.address = address;
    if (capacity) meetup.capacity = capacity;
    if (isFeatured !== undefined) meetup.isFeatured = isFeatured;

    await meetup.save();
    return successResponse(res, 200, 'Meetup updated successfully', meetup);
  } catch (error) {
    return errorResponse(res, 500, 'Server Error', error);
  }
};
