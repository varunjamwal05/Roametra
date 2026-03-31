import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getPackingList,
  createPackingItem,
  togglePackingItem,
  deletePackingItem,
} from '../../api/trips.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing', 'toiletries', 'electronics', 'documents', 'other'];
const CAT_ICONS = { clothing: '👕', toiletries: '🧴', electronics: '📱', documents: '📄', other: '🎒' };

const PackingTab = ({ tripId }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: '', category: 'other' });
  const [submitting, setSubmitting] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const fetchItems = async () => {
    try {
      const { data } = await getPackingList(tripId);
      setItems(data.items);
    } catch { toast.error('Failed to load packing list'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createPackingItem(tripId, form);
      setItems((prev) => [...prev, data.item]);
      setForm({ label: '', category: 'other' });
    } catch { toast.error('Failed to add item'); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (itemId) => {
    try {
      const { data } = await togglePackingItem(tripId, itemId);
      setItems((prev) => prev.map((i) => i._id === itemId ? data.item : i));
    } catch { toast.error('Toggle failed'); }
  };

  const handleDelete = async (itemId) => {
    try {
      await deletePackingItem(tripId, itemId);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch { toast.error('Delete failed'); }
  };

  const filtered = filterCat === 'all' ? items : items.filter((i) => i.category === filterCat);
  const checkedCount = items.filter((i) => i.checkedBy?.length > 0).length;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <motion.div className="tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tab-header">
        <h2>Packing List</h2>
        <span className="text-muted">{checkedCount}/{items.length} packed</span>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="packing-progress">
          <div className="progress-bar" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
        </div>
      )}

      {/* Add item form */}
      <form className="packing-add-form" onSubmit={handleAdd}>
        <input
          id="packing-label"
          type="text"
          placeholder="Add an item…"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <select id="packing-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
        </select>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting} id="add-packing-btn">
          {submitting ? '…' : 'Add'}
        </button>
      </form>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${filterCat === cat ? 'active' : ''}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat === 'all' ? '🎒 All' : `${CAT_ICONS[cat]} ${cat}`}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎒</span>
          <p>No items in this category yet.</p>
        </div>
      ) : (
        <div className="packing-list">
          <AnimatePresence>
            {filtered.map((item) => {
              const isChecked = item.checkedBy?.some((id) => (id?._id ?? id) === user._id);
              return (
                <motion.div
                  key={item._id}
                  className={`packing-item ${isChecked ? 'checked' : ''}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <button
                    className={`check-btn ${isChecked ? 'checked' : ''}`}
                    onClick={() => handleToggle(item._id)}
                  >
                    {isChecked ? '✓' : ''}
                  </button>
                  <div className="packing-item-label">
                    <span className="item-cat-icon">{CAT_ICONS[item.category] || '🎒'}</span>
                    <span className={isChecked ? 'strikethrough' : ''}>{item.label}</span>
                  </div>
                  <div className="packing-checkers">
                    {item.checkedBy?.map((c) => (
                      <span key={c?._id ?? c} className="checker-avatar" title={c?.name}>
                        {(c?.name || '?')[0]}
                      </span>
                    ))}
                  </div>
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(item._id)}>✕</button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default PackingTab;
