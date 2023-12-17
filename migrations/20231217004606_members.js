/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('members', function (table) {
    table.string('code').primary();
    table.string('kid_name').notNullable();
    table.string('is_asd').defaultTo(true).notNullable();
    table.string('parent_name').notNullable();
    table.text('phone_no').notNullable();
    table.text('email').notNullable;
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('members');
};
