/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('articles', function (table) {
        table.increments('id').primary();
        table.boolean('publish').notNullable().defaultTo(false);
        table.string('title').notNullable().unique();
        table.string('poster').notNullable();
        table.text('content', 'longtext').nullable();
        table.text('urlTitle').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());                
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('articles');
};
