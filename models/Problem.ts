import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  order: Number,
  title: { uz: String, ru: String, en: String },
  description: { uz: String, ru: String, en: String },
  imageUrl: String,
});

const problemSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['hardware', 'software'], required: true },
    subcategory: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    name: { uz: String, ru: String, en: String },
    icon: { type: String },
    videoUrl: String,
    steps: [stepSchema],
    warning: { uz: String, ru: String, en: String },
    tip: { uz: String, ru: String, en: String },
    tags: [String],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
