import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getTripExpenses,
  createExpense,
  deleteExpense,
  settleSplit,
  getSettlement,
} from '../../api/trips.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const CATEGORIES = ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'];
const CAT_ICONS = { food: '🍕', transport: '🚗', accommodation: '🏨', entertainment: '🎭', shopping: '🛍️', other: '💳' };

const ExpenseTab = ({ tripId, trip }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', amount: '', paidBy: user._id, category: 'other', date: '', splits: [],
  });

  const members = trip?.members || [];

  const fetchAll = async () => {
    try {
      const [expRes, setRes] = await Promise.all([getTripExpenses(tripId), getSettlement(tripId)]);
      setExpenses(expRes.data.expenses);
      setSettlement(setRes.data.transactions);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [tripId]);

  // Auto-distribute splits equally when amount changes
  const handleAmountChange = (val) => {
    const amount = parseFloat(val) || 0;
    const share = members.length > 0 ? Math.round((amount / members.length) * 100) / 100 : 0;
    setForm((f) => ({
      ...f,
      amount: val,
      splits: members.map((m) => ({ userId: m.userId?._id ?? m.userId, share })),
    }));
  };

  const handleSplitChange = (userId, shareVal) => {
    setForm((f) => ({
      ...f,
      splits: f.splits.map((s) => s.userId === userId ? { ...s, share: parseFloat(shareVal) || 0 } : s),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createExpense(tripId, { ...form, amount: parseFloat(form.amount) });
      toast.success('Expense added!');
      setShowForm(false);
      setForm({ title: '', amount: '', paidBy: user._id, category: 'other', date: '', splits: [] });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally { setSubmitting(false); }
  };

  const handleSettle = async (expId) => {
    try {
      await settleSplit(tripId, expId);
      toast.success('Marked as settled!');
      fetchAll();
    } catch { toast.error('Failed to settle'); }
  };

  const handleDelete = async (expId) => {
    try {
      await deleteExpense(tripId, expId);
      setExpenses((e) => e.filter((x) => x._id !== expId));
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const getMemberName = (id) => {
    const m = members.find((m) => (m.userId?._id ?? m.userId) === id);
    return m?.userId?.name ?? 'Unknown';
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <motion.div className="tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tab-header">
        <h2>Expenses</h2>
        <div className="tab-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSettlement((s) => !s)} id="settlement-btn">
            ⚖️ Settle Up
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)} id="add-expense-btn">
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="expense-summary">
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">${total.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Expenses</span>
          <span className="stat-value">{expenses.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚡</span>
          <span className="stat-label">To Settle</span>
          <span className="stat-value">{settlement.length}</span>
        </div>
      </div>

      {/* Settlement panel */}
      <AnimatePresence>
        {showSettlement && (
          <motion.div className="settlement-panel card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <h3>Settlement Summary</h3>
            {settlement.length === 0 ? (
              <p className="text-muted">🎉 All settled up!</p>
            ) : (
              settlement.map((t, i) => (
                <div key={i} className="settlement-row">
                  <span className="settlement-from">{getMemberName(t.from)}</span>
                  <span className="settlement-arrow">→ pays →</span>
                  <span className="settlement-to">{getMemberName(t.to)}</span>
                  <span className="settlement-amount">${t.amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add expense form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className="card expense-form"
            onSubmit={handleCreate}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="form-row">
              <input id="exp-title" type="text" placeholder="What was it for? *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input id="exp-amount" type="number" step="0.01" min="0" placeholder="Amount *" value={form.amount} onChange={(e) => handleAmountChange(e.target.value)} required />
            </div>
            <div className="form-row">
              <select id="exp-paidby" value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })}>
                {members.map((m) => (
                  <option key={m.userId?._id ?? m.userId} value={m.userId?._id ?? m.userId}>
                    Paid by: {m.userId?.name ?? 'Unknown'}
                  </option>
                ))}
              </select>
              <select id="exp-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <input id="exp-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            {form.splits.length > 0 && (
              <div className="splits-section">
                <h4>Split</h4>
                {form.splits.map((s) => (
                  <div key={s.userId} className="split-row">
                    <span>{getMemberName(s.userId)}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={s.share}
                      onChange={(e) => handleSplitChange(s.userId, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Expense'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Expense list */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💳</span>
          <p>No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((exp) => {
            const myShare = exp.splits?.find((s) => (s.userId?._id ?? s.userId) === user._id);
            return (
              <div key={exp._id} className="expense-item card">
                <div className="expense-left">
                  <span className="expense-cat-icon">{CAT_ICONS[exp.category] || '💳'}</span>
                  <div>
                    <strong>{exp.title}</strong>
                    <p className="text-muted">Paid by {exp.paidBy?.name ?? 'Unknown'}</p>
                    {exp.date && <p className="text-muted">{new Date(exp.date).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                  {myShare && !myShare.settled && (
                    <button className="btn btn-ghost btn-xs" onClick={() => handleSettle(exp._id)}>✓ Settle</button>
                  )}
                  {myShare?.settled && <span className="badge badge-admin">Settled</span>}
                  {exp.paidBy?._id === user._id && (
                    <button className="btn btn-danger btn-xs" onClick={() => handleDelete(exp._id)}>🗑</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ExpenseTab;
