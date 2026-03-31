import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyTrips, joinTrip } from '../api/trips.api.js';
import TripCard from '../components/TripCard.jsx';
import Navbar from '../components/Navbar.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);

  const fetchTrips = async () => {
    try {
      const { data } = await getMyTrips();
      setTrips(data.trips);
    } catch {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrips(); }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    try {
      await joinTrip(inviteCode.trim().toUpperCase());
      toast.success('Joined trip!');
      setInviteCode('');
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid invite code');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Hey, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-muted">Your upcoming adventures</p>
          </div>
          <Link to="/trips/new" className="btn btn-primary" id="create-trip-btn">
            + New Trip
          </Link>
        </div>

        {/* Join by invite code */}
        <form className="join-form" onSubmit={handleJoin}>
          <input
            id="invite-code-input"
            type="text"
            placeholder="Enter invite code to join a trip…"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            maxLength={12}
          />
          <button type="submit" className="btn btn-secondary" disabled={joining} id="join-trip-btn">
            {joining ? '…' : 'Join'}
          </button>
        </form>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : trips.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="empty-icon">✈</span>
            <h2>No trips yet</h2>
            <p>Create your first trip or join one with an invite code.</p>
            <Link to="/trips/new" className="btn btn-primary">Plan a Trip</Link>
          </motion.div>
        ) : (
          <div className="trips-grid">
            <AnimatePresence>
              {trips.map((trip, i) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <TripCard trip={trip} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
