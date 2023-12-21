const express = require('express');

const { getAllMembers, createMember } = require('./members.controller');
const {
  createAppointment,
  getHourMember,
  downloadCasdi,
} = require('./casdi-appointment.controller');
const router = express.Router();

router.route('/members').get(getAllMembers).post(createMember);
router.route('/appointments').post(createAppointment);
router.route('/appointments/hour').post(getHourMember);
router.route('/appointments/download').get(downloadCasdi);

module.exports = router;
