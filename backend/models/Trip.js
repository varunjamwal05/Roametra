import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    coverImage: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    inviteCode: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
