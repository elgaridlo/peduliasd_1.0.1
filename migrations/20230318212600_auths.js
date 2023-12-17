/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('auths', function (table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique().index();
    table.string('password').notNullable();
    table.enu('role', ['member', 'admin']).defaultTo('member');
    table.boolean('active').defaultTo(true);
    table.timestamp('passwordChangedAt');
    table.timestamp('passwordResetExpired');
    table.string('passwordResetToken');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('auths');
};
