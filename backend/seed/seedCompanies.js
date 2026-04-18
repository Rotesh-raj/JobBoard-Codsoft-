import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Company from '../models/Company.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
connectDB();

const seedData = async () => {
  try {
    // Read the companies JSON file
    const companiesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'top100companies.json'), 'utf-8')
    );

    // Clear existing companies
    await Company.deleteMany();
    
    // Insert new companies
    await Company.insertMany(companiesData);
    
    console.log(`Successfully seeded ${companiesData.length} companies!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
