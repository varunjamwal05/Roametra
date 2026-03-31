import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrip, deleteTrip } from '../api/trips.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import OverviewTab from '../components/tabs/OverviewTab.jsx';
import VotingTab from '../components/tabs/VotingTab.jsx';
import ItineraryTab from '../components/tabs/ItineraryTab.jsx';
import ExpenseTab from '../components/tabs/ExpenseTab.jsx';
import PackingTab from '../components/tabs/PackingTab.jsx';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview', label: '🗺️ Overview' },
  { id: 'itinerary', label: '📅 Itinerary' },
  { id: 'expenses', label: '💸 Expenses' },
  { id: 'voting', label: '🗳️ Voting' },
  { id: 'packing', label: '🎒 Packing' },
];

const TripPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getTrip(id)
      .then((res) => setTrip(res.data.trip))
      .catch(() => toast.error('Trip not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const isAdmin = trip?.members?.some(
    (m) => (m.userId?._id ?? m.userId) === user?._id && m.role === 'admin'
  );

  const handleDelete = async () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await deleteTrip(id);
      toast.success('Trip deleted');
      navigate('/dashboard');
    } catch { toast.error('Failed to delete trip'); }
  };

  if (loading) return (
    <div className="loading-screen">
      <Navbar />
      <div className="loading-center"><div className="spinner" /></div>
    </div>
  );

  if (!trip) return (
    <div>
      <Navbar />
      <div className="empty-state">
        <span className="empty-icon">❌</span>
        <p>Trip not found</p>
        <Link to="/dashboard" className="btn btn-primary">Go back</Link>
      </div>
    </div>
  );

  return (
    <div className="trip-page">
      <Navbar />
      <main className="trip-main">
        <div className="trip-page-header">
          <div>
            <Link to="/dashboard" className="back-link">← Dashboard</Link>
            <h1>{trip.name}</h1>
            <p className="text-muted">📍 {trip.destination}</p>
          </div>
          {isAdmin && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete} id="delete-trip-btn">
              🗑 Delete Trip
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab trip={trip} />}
            {activeTab === 'itinerary' && <ItineraryTab tripId={id} trip={trip} />}
            {activeTab === 'expenses' && <ExpenseTab tripId={id} trip={trip} />}
            {activeTab === 'voting' && <VotingTab tripId={id} />}
            {activeTab === 'packing' && <PackingTab tripId={id} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TripPage;
