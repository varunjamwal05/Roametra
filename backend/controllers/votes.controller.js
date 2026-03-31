import Vote from '../models/Vote.js';

export const create = async (req, res, next) => {
  try {
    const vote = await Vote.create({
      tripId: req.params.id,
      createdBy: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, vote });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const votes = await Vote.find({ tripId: req.params.id })
      .populate('createdBy', 'name')
      .populate('votes.userId', 'name');
    res.json({ success: true, votes });
  } catch (err) {
    next(err);
  }
};

export const castVote = async (req, res, next) => {
  try {
    const vote = await Vote.findById(req.params.voteId);
    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });
    const already = vote.votes.find((v) => v.userId.toString() === req.user._id.toString());
    if (already) {
      // toggle off
      vote.votes = vote.votes.filter((v) => v.userId.toString() !== req.user._id.toString());
    } else {
      vote.votes.push({ userId: req.user._id });
    }
    await vote.save();
    res.json({ success: true, vote });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await Vote.findByIdAndDelete(req.params.voteId);
    res.json({ success: true, message: 'Vote option deleted' });
  } catch (err) {
    next(err);
  }
};
