'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BalanceSchema extends Schema {
  up () {
    this.create('balances', (table) => {
      table.increments()
      table.bigInteger("balance")
      table.integer("users_id").unsigned().unique();
      table.foreign("users_id")
            .references('id')
            .inTable("users")
            .onDelete('cascade')
            .onUpdate('cascade');
      table.timestamps()
    })
  }

  down () {
    this.drop('balances')
  }
}

module.exports = BalanceSchema
