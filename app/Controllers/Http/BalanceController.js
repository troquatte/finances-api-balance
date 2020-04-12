'use strict'
const Expense = use('App/Models/Expense');
const Tag = use('App/Models/Tag');

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

    let { page, tag, prev_date, curr_date } = request.all()

    //Validation Params
    if(!tag  || tag == 0  || tag == "undefined") tag = false;
    if(!prev_date || prev_date == 0 || prev_date == "undefined") prev_date = false
    if(!curr_date || curr_date == 0 || curr_date == "undefined") curr_date = false
    if(!page || page == 0 || page == "undefined") page = 1;

    //Query Find User create Expense
    let receita = Expense.query().where({ users_id: users_id, type: "receita" });
    let despesa = Expense.query().where({ users_id: users_id, type: "despesa" });

    //Tag == true
    //Add: true search and Sum
    if(tag){
      receita.whereHas('tag', (builder) => {
          builder.where({tag_id: tag}, true)
      });

      despesa.whereHas('tag', (builder) => {
        builder.where({tag_id: tag}, true)
      });
    }

    //Prev and Curr Date == True
    //Add: Search range date and Sum
    if(prev_date && curr_date){
      receita.whereBetween("range", [prev_date, curr_date]);
      despesa.whereBetween("range", [prev_date, curr_date]);
    }


    //Find and Sum All Query
    receita = await receita.sum("value").first();
    despesa = await despesa.sum("value").first();

    const balance = receita.sum - despesa.sum;

    //Return Json
    return response.status(200).json({
      status: 200,
      response: {
        receita: receita.sum,
        despesa: despesa.sum,
        balance: balance
      }
    });
  }

}

module.exports = BalanceController
