# Job Board Platform - Deployment & Configuration Checklist

This guide outlines exactly what Environment Variables (`.env`) you need to configure and where to inject real data to prepare your application for a production environment.

## 1. Backend Configuration (`backend/.env`)

Create or update the `.env` file in the `backend/` directory with your actual production credentials:

```env
# 1. Server Port
PORT=5000

# 2. Database Connection (CRITICAL for Deployment)
# Change from 'mongodb://127.0.0.1:27017' to your MongoDB Atlas connection string.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobboard

# 3. Security (CRITICAL for Deployment)
# Change this to a long, random secure string (e.g., generated via 'openssl rand -base64 32')
JWT_SECRET=your_super_secret_production_key_here

# 4. Email Notifications (Optional but recommended)
# Used by Nodemailer to send 'Application Received' or 'Job Posted' emails.
# If using Gmail, use an "App Password", not your normal password.
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# 5. External Job Data (Adzuna API)
# Get these by registering at https://developer.adzuna.com/
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

## 2. Frontend Configuration (`frontend/.env`)

For the React frontend to communicate with your deployed backend, create a `.env` file inside the `frontend/` directory (next to `package.json`).

```env
# URL of your deployed backend (e.g., Render, Heroku)
VITE_API_URL=https://your-backend-app-name.onrender.com/api
```

> **Important Code Change needed in Frontend:** 
> Currently, the frontend hardcodes `http://localhost:5000` for API calls. 
> To make it production-ready, update your Axios calls to use this environment variable.
> 
> *Example Implementation (in `frontend/src/context/AuthContext.jsx` and `frontend/src/pages/Home.jsx`):*
> ```javascript
> const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
> const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
> ```

## 3. Where to Replace Mock/Placeholder Data with Real Data

To make the app completely production-ready, you should modify the following areas:
  
*   **Email Sending Logic:** In `backend/controllers/jobController.js` (inside `createJob`) and `applicationController.js`, implement the `nodemailer` logic using the `EMAIL_USER` and `EMAIL_PASS` variables to actually send emails. Right now, it just has a comment: `// In a real app, we'd send an email here using nodemailer`.
*   **Resume Uploads (Cloudinary):** The `Application` model expects a `resumeUrl`. For a real implementation, you should set up a route using `multer` and `cloudinary` to handle PDF/Doc uploads and save the returned secure URL natively to the DB.
*   **Company Logos:** The seed file (`backend/seed/top100companies.json`) uses `logo.clearbit.com`. This is excellent for production, but ensure it meets your usage requirements.

## 4. Deployment Steps

1.  **Database:** Deploy your database on **MongoDB Atlas**. Whitelist IP address `0.0.0.0/0` so your backend can connect.
2.  **Backend:** Deploy the `backend/` folder to a service like **Render**, **Railway**, or **Heroku**. Add all the variables from `backend/.env` into the environment variable settings of your hosting provider.
3.  **Frontend:** Update your Axios base URLs. Deploy the `frontend/` folder to **Vercel** or **Netlify**. Add `VITE_API_URL` to the environment variables on Vercel/Netlify pointing to your newly deployed backend URL.
