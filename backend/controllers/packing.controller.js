import PackingItem from '../models/PackingItem.js';

export const getAll = async (req, res, next) => {
  try {
    const items = await PackingItem.find({ tripId: req.params.id })
      .populate('addedBy', 'name')
      .populate('checkedBy', 'name')
      .sort({ createdAt: 1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const item = await PackingItem.create({
      tripId: req.params.id,
      addedBy: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const toggleCheck = async (req, res, next) => {
  try {
    const item = await PackingItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const idx = item.checkedBy.findIndex((id) => id.toString() === req.user._id.toString());
    if (idx === -1) {
      item.checkedBy.push(req.user._id);
    } else {
      item.checkedBy.splice(idx, 1);
    }
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await PackingItem.findByIdAndDelete(req.params.itemId);
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    next(err);
  }
};
