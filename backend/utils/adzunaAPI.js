import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache: items expire in 3600 seconds (1 hour)
const jobCache = new NodeCache({ stdTTL: 3600 });

export const fetchAdzunaJobs = async (keyword, location) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.warn('Adzuna API keys are not configured. Returning empty external jobs.');
    return [];
  }

  // Create a unique cache key based on search params
  const cacheKey = `adzuna_${keyword || 'all'}_${location || 'all'}`;
  
  if (jobCache.has(cacheKey)) {
    return jobCache.get(cacheKey);
  }

  try {
    // Adzuna API endpoint structure: /api/jobs/us/search/1?app_id=...&app_key=...&what=...&where=...
    // Defaults to 'us' for region in this example
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1`, {
      params: {
        app_id: appId,
        app_key: appKey,
        results_per_page: 20,
        what: keyword || '',
        where: location || '',
        'content-type': 'application/json'
      }
    });

    const externalJobs = response.data.results.map(job => ({
      _id: `adzuna_${job.id}`,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // strip possible html tags
      company: job.company.display_name,
      location: job.location.display_name,
      type: 'External', // label to mark as external API job
      salaryRange: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Not Specified',
      description: job.description.replace(/<\/?[^>]+(>|$)/g, ""),
      url: job.redirect_url, // For linking users to real job post
      isExternal: true
    }));

    // Save to cache
    jobCache.set(cacheKey, externalJobs);

    return externalJobs;
  } catch (error) {
    console.error('Error fetching jobs from Adzuna API:', error.message);
    return []; // Return empty array on failure instead of crashing
  }
};
