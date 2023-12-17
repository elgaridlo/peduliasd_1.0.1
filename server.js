const express = require('express');
const dotenv = require('dotenv');
const routes = require('./backend/routes/index.routes');
const errorHandler = require('./backend/utils/error-handling');
const path = require('path');
const appError = require('./backend/utils/appError');

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env['PORT'] || 5000;

// Routing
app.use(routes);

app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));
// const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), '/peduliasd/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(process.cwd(), 'peduliasd', 'build', 'index.html'),
    ),
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.all('*', (req, res, next) => {
  next(
    new appError(
      `Cannot find this url ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
