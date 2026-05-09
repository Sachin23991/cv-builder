import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const AIMemorySchema = new Schema({
  userId: { type: String, required: true, index: true },
  lastTargetRole: { type: String, default: '' },
  preferences: { type: Schema.Types.Mixed, default: {} },
  facts: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

AIMemorySchema.index({ userId: 1 }, { unique: true });

export const AIMemory = models.AIMemory || model('AIMemory', AIMemorySchema);
export default AIMemory;
