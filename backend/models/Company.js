import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;
