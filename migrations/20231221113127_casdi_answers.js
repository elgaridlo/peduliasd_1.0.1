/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('casdi_answers', function (table) {
    table.increments('id').primary();
    table.integer('question_id').unsigned().notNullable().unique();
    table
      .foreign('question_id')
      .references('casdi_questions.id')
      .onDelete('CASCADE');
    table.string('answer').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('casdi_answers');
};
