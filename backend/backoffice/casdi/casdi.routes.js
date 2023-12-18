const express = require('express');
const { getAllMembers, createMember } = require('./members.controller');
const { createAppointment } = require('./casdi-appointment.controller');
const router = express.Router();

router.route('/members').get(getAllMembers).post(createMember);
router.route('/appointments').post(createAppointment);

module.exports = router;
