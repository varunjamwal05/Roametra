import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    day: { type: Number, required: true, min: 1 },
    order: { type: Number, default: 0 }, // for drag-and-drop reordering
    time: { type: String, default: '' }, // e.g. "14:30"
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    type: {
      type: String,
      enum: ['activity', 'meal', 'transport', 'accommodation', 'other'],
      default: 'activity',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const ItineraryItem = mongoose.model('ItineraryItem', itineraryItemSchema);
export default ItineraryItem;
