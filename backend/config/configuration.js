const dotenv = require('dotenv')
dotenv.config()

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : process.env['DATABASE_URL'],
      port : process.env['DATABASE_PORT'],
      user : process.env['DATABASE_USER'],
      password : process.env['DATABASE_PASSWORD'],
      database : process.env['DATABASE_DATABASE']
    },
  });

  module.exports = knex