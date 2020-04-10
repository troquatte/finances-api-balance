'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Expense extends Model {
  static get visible() {
    return ["id", "description", "value", "period", "categoria"];
  }

  tag(){
    return this.belongsToMany('App/Models/Tag', 'expense_id', 'tag_id').pivotTable('tag_expenses');
  }
}

module.exports = Expense
