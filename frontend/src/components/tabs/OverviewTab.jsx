import { motion } from 'framer-motion';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : '';

const OverviewTab = ({ trip }) => {
  const dayCount = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Cover */}
      <div
        className="overview-cover"
        style={{
          background: trip.coverImage
            ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${trip.coverImage}) center/cover`
            : 'linear-gradient(135deg, #667eea, #764ba2)',
        }}
      >
        <h2 className="overview-trip-name">{trip.name}</h2>
        <p className="overview-dest">📍 {trip.destination}</p>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-label">Duration</span>
          <span className="stat-value">{dayCount} day{dayCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-label">Members</span>
          <span className="stat-value">{trip.members?.length ?? 1}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🗓</span>
          <span className="stat-label">Start</span>
          <span className="stat-value">{formatDate(trip.startDate)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏁</span>
          <span className="stat-label">End</span>
          <span className="stat-value">{formatDate(trip.endDate)}</span>
        </div>
      </div>

      {/* Invite code */}
      <div className="invite-section">
        <h3>Invite Code</h3>
        <div className="invite-code-box">
          <span className="invite-code">{trip.inviteCode}</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(trip.inviteCode);
            }}
          >
            Copy
          </button>
        </div>
        <p className="text-muted">Share this code so friends can join the trip.</p>
      </div>

      {/* Members list */}
      <div className="members-section">
        <h3>Members</h3>
        <div className="members-list">
          {trip.members?.map((m) => (
            <div key={m.userId?._id ?? m.userId} className="member-item">
              <div className="member-avatar">
                {(m.userId?.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="member-name">{m.userId?.name ?? 'Unknown'}</p>
                <p className="member-email text-muted">{m.userId?.email ?? ''}</p>
              </div>
              <span className={`badge badge-${m.role}`}>{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
