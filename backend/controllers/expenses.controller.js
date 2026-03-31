import * as expenseService from '../services/expenses.service.js';

export const create = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.params.id, req.body);
    res.status(201).json({ success: true, expense });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const expenses = await expenseService.getTripExpenses(req.params.id);
    res.json({ success: true, expenses });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.expId);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};

export const settle = async (req, res, next) => {
  try {
    const expense = await expenseService.settleSplit(req.params.expId, req.user._id);
    res.json({ success: true, expense });
  } catch (err) {
    next(err);
  }
};

export const getSettlement = async (req, res, next) => {
  try {
    const transactions = await expenseService.computeSettlement(req.params.id);
    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};
