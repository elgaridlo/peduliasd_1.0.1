const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `uploads/${req.originalUrl.split('/')[3]}/`);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/eduProgram', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

router.post('/article', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

router.post('/product', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

router.post('/casdi-article', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = router;
