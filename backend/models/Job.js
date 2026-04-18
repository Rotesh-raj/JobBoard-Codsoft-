import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  companyLogo: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  },
  salaryRange: {
    type: String, // e.g., "$80,000 - $120,000"
    required: true
  },
  skills: [{ type: String }],
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create text index for search
jobSchema.index({ title: 'text', company: 'text', location: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);
export default Job;
