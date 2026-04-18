import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job'
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  resumeUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
