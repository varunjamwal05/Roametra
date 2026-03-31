import mongoose from 'mongoose';

const packingItemSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    label: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['clothing', 'toiletries', 'electronics', 'documents', 'other'],
      default: 'other',
    },
    checkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const PackingItem = mongoose.model('PackingItem', packingItemSchema);
export default PackingItem;
