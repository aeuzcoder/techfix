import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  viewedAt: { type: Date, default: Date.now },
});

// Ensure a user can only have one history entry per problem per day (handled in controller)
// or just index for querying if needed.

export const History = mongoose.models.History || mongoose.model('History', historySchema);
