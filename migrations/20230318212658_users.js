const { v4: uuid } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('fullname').notNullable();
        table.string('phone').notNullable().unique();
        table.string('address').notNullable();
        table.string('place_birth').nullable();
        table.timestamp('date_birth').nullable();
        table.string('race').nullable();
        table.string('last_education').nullable();
        table.enum('role', ['mother', 'father']).defaultTo('mother').notNullable();
        table.integer('auth_id').unsigned().notNullable();
        table.foreign('auth_id').references('auths.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
