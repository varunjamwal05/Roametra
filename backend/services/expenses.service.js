import Expense from '../models/Expense.js';

export const createExpense = async (tripId, data) => {
  return await Expense.create({ tripId, ...data });
};

export const getTripExpenses = async (tripId) => {
  return await Expense.find({ tripId })
    .populate('paidBy', 'name email')
    .populate('splits.userId', 'name email')
    .sort({ date: -1 });
};

export const deleteExpense = async (expenseId) => {
  return await Expense.findByIdAndDelete(expenseId);
};

export const settleSplit = async (expenseId, userId) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    const err = new Error('Expense not found');
    err.status = 404;
    throw err;
  }
  const split = expense.splits.find((s) => s.userId.toString() === userId.toString());
  if (!split) {
    const err = new Error('Split not found for this user');
    err.status = 404;
    throw err;
  }
  split.settled = true;
  await expense.save();
  return expense;
};

/**
 * Compute net settlement balances for a trip.
 * Returns: [{ from: userId, to: userId, amount: Number }]
 * Uses a greedy algorithm to minimize number of transactions.
 */
export const computeSettlement = async (tripId) => {
  const expenses = await Expense.find({ tripId });

  // net[userId] = total paid - total owed (unsettled)
  const net = {};

  const add = (id, val) => {
    const key = id.toString();
    net[key] = (net[key] || 0) + val;
  };

  for (const expense of expenses) {
    // paidBy gets credit for full amount
    add(expense.paidBy, expense.amount);
    // each split person owes their share (if unsettled)
    for (const split of expense.splits) {
      if (!split.settled) {
        add(split.userId, -split.share);
      }
    }
  }

  // Separate into creditors (positive) and debtors (negative)
  const creditors = [];
  const debtors = [];
  for (const [userId, balance] of Object.entries(net)) {
    if (balance > 0.01) creditors.push({ userId, amount: balance });
    else if (balance < -0.01) debtors.push({ userId, amount: -balance });
  }

  const transactions = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];
    const amount = Math.min(debt.amount, credit.amount);
    transactions.push({
      from: debt.userId,
      to: credit.userId,
      amount: Math.round(amount * 100) / 100,
    });
    debt.amount -= amount;
    credit.amount -= amount;
    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  return transactions;
};
