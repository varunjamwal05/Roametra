import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    trips: [
      {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
      },
    ],
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
