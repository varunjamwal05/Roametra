import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'],
      default: 'other',
    },
    splits: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        share: { type: Number, required: true }, // exact amount this person owes
        settled: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
