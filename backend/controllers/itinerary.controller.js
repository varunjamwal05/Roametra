import ItineraryItem from '../models/ItineraryItem.js';

export const getAll = async (req, res, next) => {
  try {
    const items = await ItineraryItem.find({ tripId: req.params.id })
      .populate('createdBy', 'name')
      .sort({ day: 1, order: 1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const item = await ItineraryItem.create({
      tripId: req.params.id,
      createdBy: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await ItineraryItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await ItineraryItem.findByIdAndDelete(req.params.itemId);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

export const reorder = async (req, res, next) => {
  try {
    // req.body.items = [{ _id, order }]
    const { items } = req.body;
    const ops = items.map(({ _id, order }) =>
      ItineraryItem.findByIdAndUpdate(_id, { order })
    );
    await Promise.all(ops);
    res.json({ success: true, message: 'Reordered' });
  } catch (err) {
    next(err);
  }
};
