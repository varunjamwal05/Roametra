import * as tripsService from '../services/trips.service.js';

export const create = async (req, res, next) => {
  try {
    const trip = await tripsService.createTrip(req.user._id, req.body);
    res.status(201).json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

export const getMyTrips = async (req, res, next) => {
  try {
    const trips = await tripsService.getUserTrips(req.user._id);
    res.json({ success: true, trips });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const trip = await tripsService.getTripById(req.params.id);
    res.json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

export const join = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    const trip = await tripsService.joinTripByCode(req.user._id, inviteCode);
    res.json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await tripsService.getTripMembers(req.params.id);
    res.json({ success: true, members });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await tripsService.deleteTrip(req.params.id, req.user._id);
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
};
