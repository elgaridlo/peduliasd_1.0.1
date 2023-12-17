const express = require('express');
const {
  createProgrammes,
  deleteProgrammes,
  getAllProgrammes,
  getProgrammesById,
} = require('./programme.controller');
const router = express.Router();

router.route('/').get(getAllProgrammes).post(createProgrammes);
router.route('/:id').get(getProgrammesById).delete(deleteProgrammes);

module.exports = router;
