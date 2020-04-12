'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
  static get visible() {
    return ["tag", "categoria"];
  }


}

module.exports = Tag
