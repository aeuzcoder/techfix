import mongoose from 'mongoose';

const bookedSlotSchema = new mongoose.Schema({
  date: String, // YYYY-MM-DD
  time: String, // HH:MM
});

const advisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: [{ type: String }],
  avatar: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  bookedSlots: [bookedSlotSchema],
});

export const Advisor = mongoose.models.Advisor || mongoose.model('Advisor', advisorSchema);
