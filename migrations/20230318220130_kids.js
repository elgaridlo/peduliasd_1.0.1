/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('kids', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.string('name').nullable();
    table.timestamp('birth_date').nullable();
    table.enum('condition', ['asd', 'non']).defaultTo('non').notNullable();
    table.enum('level', ['0', '1', '2', '3']).defaultTo('0').notNullable();
    table.string('therapy_place').nullable();
    table.timestamp('first_therapy').nullable();
    table.string('description').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('kids');
};
