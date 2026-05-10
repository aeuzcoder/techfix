import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, // HH:MM
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  meetUrl: { type: String },
  price: { type: Number, default: 50000 },
}, { timestamps: true });

export const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
