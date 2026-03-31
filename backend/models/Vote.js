import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    category: {
      type: String,
      enum: ['destination', 'hotel', 'activity'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    votes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
