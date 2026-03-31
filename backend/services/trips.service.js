import Trip from '../models/Trip.js';
import User from '../models/User.js';

export const createTrip = async (userId, { name, destination, location, coverImage, startDate, endDate }) => {
  const trip = await Trip.create({
    name,
    destination,
    location,
    coverImage,
    startDate,
    endDate,
    createdBy: userId,
    members: [{ userId, role: 'admin', joinedAt: new Date() }],
  });
  // push trip to user's trip list
  await User.findByIdAndUpdate(userId, {
    $push: { trips: { tripId: trip._id, role: 'admin' } },
  });
  return trip;
};

export const getUserTrips = async (userId) => {
  const user = await User.findById(userId).populate('trips.tripId');
  return user.trips.map((t) => ({ ...t.tripId.toObject(), role: t.role }));
};

export const getTripById = async (tripId) => {
  return await Trip.findById(tripId).populate('members.userId', 'name email avatar');
};

export const joinTripByCode = async (userId, inviteCode) => {
  const trip = await Trip.findOne({ inviteCode });
  if (!trip) {
    const err = new Error('Invalid invite code');
    err.status = 404;
    throw err;
  }
  const alreadyMember = trip.members.some((m) => m.userId.toString() === userId.toString());
  if (alreadyMember) {
    const err = new Error('Already a member of this trip');
    err.status = 409;
    throw err;
  }
  trip.members.push({ userId, role: 'member', joinedAt: new Date() });
  await trip.save();
  await User.findByIdAndUpdate(userId, {
    $push: { trips: { tripId: trip._id, role: 'member' } },
  });
  return trip;
};

export const getTripMembers = async (tripId) => {
  const trip = await Trip.findById(tripId).populate('members.userId', 'name email avatar');
  return trip.members;
};

export const deleteTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const err = new Error('Trip not found');
    err.status = 404;
    throw err;
  }
  const member = trip.members.find((m) => m.userId.toString() === userId.toString());
  if (!member || member.role !== 'admin') {
    const err = new Error('Only admins can delete trips');
    err.status = 403;
    throw err;
  }
  await trip.deleteOne();
  await User.updateMany({}, { $pull: { trips: { tripId } } });
};
