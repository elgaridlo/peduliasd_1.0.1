// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env['DATABASE_URL'],
      port: process.env['DATABASE_PORT'],
      user: process.env['DATABASE_USER'],
      password: process.env['DATABASE_PASSWORD'],
      database: process.env['DATABASE_DATABASE'],
    },
  },
};
