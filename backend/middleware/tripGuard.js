import Trip from '../models/Trip.js';

const tripGuard = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const isMember = trip.members.some(
      (m) => m.userId.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied: not a trip member' });
    }
    req.trip = trip; // attach trip to request
    next();
  } catch (err) {
    next(err);
  }
};

export default tripGuard;
