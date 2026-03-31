import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const TripCard = ({ trip }) => {
  const daysLeft = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className="trip-card"
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div
        className="trip-card-cover"
        style={{
          background: trip.coverImage
            ? `url(${trip.coverImage}) center/cover`
            : `linear-gradient(135deg, #667eea, #764ba2)`,
        }}
      >
        <span className="trip-card-badge">{trip.role === 'admin' ? '👑 Admin' : '👤 Member'}</span>
      </div>
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.name}</h3>
        <p className="trip-card-dest">📍 {trip.destination}</p>
        <div className="trip-card-dates">
          <span>{formatDate(trip.startDate)}</span>
          <span className="trip-dates-sep">→</span>
          <span>{formatDate(trip.endDate)}</span>
        </div>
        {daysLeft > 0 && (
          <p className="trip-card-countdown">
            🗓 {daysLeft} day{daysLeft !== 1 ? 's' : ''} away
          </p>
        )}
        <div className="trip-card-footer">
          <span className="trip-member-count">
            👥 {trip.members?.length ?? 1} member{(trip.members?.length ?? 1) !== 1 ? 's' : ''}
          </span>
          <Link to={`/trips/${trip._id}`} className="btn btn-primary btn-sm">
            Open →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
