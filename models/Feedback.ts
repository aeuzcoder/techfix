import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  email: { type: String, required: true },
  name: { type: String },
  message: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  adminReply: { type: String },
}, { timestamps: true });

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
