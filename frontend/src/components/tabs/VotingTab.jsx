import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVotes, createVote, castVote, deleteVote } from '../../api/trips.api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

const CATEGORIES = ['destination', 'hotel', 'activity'];

const VotingTab = ({ tripId }) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'destination', description: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchVotes = async () => {
    try {
      const { data } = await getVotes(tripId);
      setVotes(data.votes);
    } catch { toast.error('Failed to load votes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVotes(); }, [tripId]);

  const handleVote = async (voteId) => {
    try {
      const { data } = await castVote(tripId, voteId);
      setVotes((v) => v.map((x) => x._id === voteId ? data.vote : x));
    } catch { toast.error('Vote failed'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createVote(tripId, form);
      toast.success('Option added!');
      setShowForm(false);
      setForm({ title: '', category: 'destination', description: '', imageUrl: '' });
      fetchVotes();
    } catch { toast.error('Failed to add option'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (voteId) => {
    try {
      await deleteVote(tripId, voteId);
      setVotes((v) => v.filter((x) => x._id !== voteId));
    } catch { toast.error('Delete failed'); }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = votes.filter((v) => v.category === cat);
    return acc;
  }, {});

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <motion.div className="tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tab-header">
        <h2>Group Voting</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)} id="add-vote-btn">
          {showForm ? 'Cancel' : '+ Add Option'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="vote-form card"
            onSubmit={handleCreate}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <select id="vote-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <input id="vote-title" type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input id="vote-desc" type="text" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input id="vote-image" type="url" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Option'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {CATEGORIES.map((cat) => (
        grouped[cat].length > 0 && (
          <div key={cat} className="vote-category-section">
            <h3 className="vote-category-label">
              {cat === 'destination' ? '🗺️' : cat === 'hotel' ? '🏨' : '🎯'} {cat.charAt(0).toUpperCase() + cat.slice(1)}s
            </h3>
            <div className="votes-grid">
              {grouped[cat].map((v) => {
                const hasVoted = v.votes.some((vote) => vote.userId?._id === user._id || vote.userId === user._id);
                return (
                  <div key={v._id} className={`vote-card ${hasVoted ? 'voted' : ''}`}>
                    {v.imageUrl && <img src={v.imageUrl} alt={v.title} className="vote-img" onError={(e) => e.target.style.display = 'none'} />}
                    <div className="vote-card-body">
                      <h4>{v.title}</h4>
                      {v.description && <p className="text-muted">{v.description}</p>}
                      <div className="vote-actions">
                        <button
                          className={`btn ${hasVoted ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                          onClick={() => handleVote(v._id)}
                        >
                          👍 {v.votes.length}
                        </button>
                        {v.createdBy?._id === user._id && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v._id)}>🗑</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      {votes.length === 0 && !showForm && (
        <div className="empty-state">
          <span className="empty-icon">🗳️</span>
          <p>No options yet. Add destinations, hotels or activities to vote on!</p>
        </div>
      )}
    </motion.div>
  );
};

export default VotingTab;
