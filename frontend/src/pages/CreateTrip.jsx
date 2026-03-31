import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createTrip } from '../api/trips.api.js';
import Navbar from '../components/Navbar.jsx';
import toast from 'react-hot-toast';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    coverImage: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.endDate < form.startDate) {
      return toast.error('End date must be after start date');
    }
    setLoading(true);
    try {
      const { data } = await createTrip(form);
      toast.success('Trip created! 🎉');
      navigate(`/trips/${data.trip._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <Navbar />
      <main className="create-trip-main">
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-card-header">
            <Link to="/dashboard" className="back-link">← Dashboard</Link>
            <h1>Plan a New Trip</h1>
            <p className="text-muted">Fill in the details and start collaborating</p>
          </div>
          <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-group">
              <label htmlFor="trip-name">Trip Name</label>
              <input
                id="trip-name"
                type="text"
                name="name"
                placeholder="e.g. Bali Summer 2025"
                value={form.name}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="trip-destination">Destination</label>
              <input
                id="trip-destination"
                type="text"
                name="destination"
                placeholder="e.g. Bali, Indonesia"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trip-start">Start Date</label>
                <input
                  id="trip-start"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trip-end">End Date</label>
                <input
                  id="trip-end"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="trip-cover">Cover Image URL (optional)</label>
              <input
                id="trip-cover"
                type="url"
                name="coverImage"
                placeholder="https://images.unsplash.com/..."
                value={form.coverImage}
                onChange={handleChange}
              />
            </div>
            {form.coverImage && (
              <div className="cover-preview">
                <img src={form.coverImage} alt="Cover preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} id="create-trip-submit">
              {loading ? 'Creating…' : 'Create Trip 🚀'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateTrip;
