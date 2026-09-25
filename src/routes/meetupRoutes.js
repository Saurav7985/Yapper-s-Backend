const express = require('express');
const router = express.Router();
const { getMeetups, getMeetupById, createMeetup, updateMeetup } = require('../controllers/meetupController');

router.get('/', getMeetups);
router.get('/:id', getMeetupById);
router.post('/', createMeetup);
router.put('/:id', updateMeetup);

module.exports = router;
