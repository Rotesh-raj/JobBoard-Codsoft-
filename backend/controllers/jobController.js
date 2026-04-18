import Job from '../models/Job.js';
import { fetchAdzunaJobs } from '../utils/adzunaAPI.js';

// @desc    Get all jobs with search and filter
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { keyword, location, company, type, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Text search if keyword is provided
    if (keyword) {
      query.$text = { $search: keyword };
    }
    
    if (location) query.location = { $regex: location, $options: 'i' };
    if (company) query.company = { $regex: company, $options: 'i' };
    if (type) query.type = type;

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    // 1. Fetch Local Jobs from DB
    const localJobs = await Job.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });
      
    // 2. Fetch External Jobs from Adzuna API
    const externalJobs = await fetchAdzunaJobs(keyword, location);
    
    // 3. Merge results
    // To handle pagination properly across combined datasets is complex.
    // For simplicity, we merge local and external jobs for the current request.
    const mergedJobs = [...localJobs, ...externalJobs];
      
    const totalLocal = await Job.countDocuments(query);

    res.json({
      jobs: mergedJobs,
      page: parseInt(page),
      pages: Math.ceil(totalLocal / limitNum), // pagination logic based on local for now
      total: totalLocal + externalJobs.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email companyName');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salaryRange, skills, description } = req.body;

    const job = new Job({
      employer: req.user._id,
      title,
      company: company || req.user.companyName,
      location,
      type,
      salaryRange,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      description
    });

    const createdJob = await job.save();
    
    // In a real app, we'd send an email here using nodemailer
    
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
