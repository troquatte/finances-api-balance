'use strict'
const Expense = use('App/Models/Expense');

class BalanceController {

  async createOrUpdate({request, response}){
    //Data request balance: number and user_id: number
    const { balance, users_id } = request.body;

    //Query Find User create Balance
    const find = await Balance.query().where({ users_id }).first();

    //Find = false
    if(!find){
      //Create new Balance
      const create = await Balance.create({ balance, users_id });

      //Return Json
      return response.status(200).json({
        status: 200,
        response: { balance: create.$originalAttributes.balance }
      });
    }

    //Find = true
    //Add new value balance and save
    find.balance = balance;
    await find.save();

    //Return Json
    return response.status(200).json({
      status: 200,
      response: { balance: find.$originalAttributes.balance }
    });

  }

  async read({request, response}){
    //Data request Expense: number and user_id: number
    const { users_id } = request.body;

    //Query Find User create Expense
    const receita = await Expense.query().where({ users_id: users_id, type: "receita" }).sum("value").first();
    const despesa = await Expense.query().where({ users_id: users_id, type: "despesa" }).sum("value").first();

    const balance = receita.sum - despesa.sum;

    //Return Json
    return response.status(200).json({
      status: 200,
      response: {
        receita: receita.sum,
        despesa: despesa.sum,
        balance
      }
    });
  }

}

module.exports = BalanceController
