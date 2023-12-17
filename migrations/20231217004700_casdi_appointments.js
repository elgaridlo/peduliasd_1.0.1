/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('casdi_appointments', function (table) {
    table.increments('id').primary();
    table.string('code_member').notNullable();
    table.foreign('code_member').references('members.code');
    table.date('appointment_date').notNullable();
    table.string('duration').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('casdi_appointments');
};
