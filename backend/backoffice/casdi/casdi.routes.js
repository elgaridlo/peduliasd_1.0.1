const express = require('express');

const { getAllMembers, createMember } = require('./members.controller');
const {
  createAppointment,
  getHourMember,
  downloadCasdi,
} = require('./casdi-appointment.controller');
const { protect, restrictTo } = require('../../auth/auth.controller');
const { createQuestion } = require('./question.controller');
const router = express.Router();

router
  .route('/members')
  .get(getAllMembers)
  .post(protect, restrictTo('admin'), createMember);
router.route('/appointments').post(createAppointment);
router.route('/appointments/hour').post(getHourMember);
router
  .route('/appointments/download')
  .get(protect, restrictTo('admin'), downloadCasdi);

router.route('/questions').post(createQuestion);

module.exports = router;
