# Skill Nest

Skill Nest is a full-stack course selling website where users can browse courses, open course details, log in with email or Google, enroll in courses, and track enrolled items from a dashboard. Admin users can create, update, and delete courses from a separate admin page.

## Features

- Public landing page with featured courses
- Course listing page
- Course detail page
- User registration and login
- Google OAuth login
- Enroll in courses
- User dashboard with enrolled courses
- Admin course CRUD
- Course mentor field support
- Toast notifications for auth actions
- Responsive UI with scroll reveal animations

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Hot Toast
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Passport Google OAuth
- bcrypt for password hashing
- helmet and express-rate-limit for basic hardening

## Project Structure

```text
Skill Nest/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

Make sure you have these installed:

- Node.js 20.19+ or 22.12+
- npm
- MongoDB Atlas or a local MongoDB server
- A Google Cloud project for OAuth login

## Environment Setup

### Backend

Create `backend/.env` from `backend/.env.example` and fill in your values:

```env
MONGODB_URL=your_mongodb_connection_string
PORT=8000
CLIENT_URL=http://localhost:5174
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback
NODE_ENV=development
```

### Frontend

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Google OAuth Setup

To use Google login:

1. Open Google Cloud Console.
2. Create or select a project.
3. Go to **OAuth consent screen** and finish the basic setup.
4. Create an **OAuth client ID**.
5. Choose **Web application**.
6. Add this redirect URI:

```text
http://localhost:8000/api/v1/users/google/callback
```

7. Copy the Client ID and Client Secret into `backend/.env`.

The backend sends users back to the same frontend origin that started the login flow, so local port changes should not break the callback.

## Admin Access

Public registration is user-only. If you want to test admin CRUD, promote a normal user account to admin with this command:

```powershell
cd backend
npm run promote-admin -- your_email@example.com
```

After that, log out and log in again. The user will have admin access.

## Installation

### 1. Install backend dependencies

```powershell
cd backend
npm install
```

### 2. Install frontend dependencies

```powershell
cd frontend
npm install
```

## Running the Project

### Start the backend

```powershell
cd backend
npm run dev
```

Backend runs on port `8000` by default.

### Start the frontend

```powershell
cd frontend
npm run dev
```

Vite usually starts on `http://localhost:5174` or the next free port.

## Available Scripts

### Backend

```json
{
  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js",
  "start": "node -r dotenv/config --experimental-json-modules src/index.js",
  "promote-admin": "node src/scripts/promoteAdmin.js"
}
```

### Frontend

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## API Endpoints

### User Routes

Base path: `/api/v1/users`

- `POST /register` - create a new user
- `POST /login` - log in with email/username and password
- `POST /refresh-token` - refresh access token
- `GET /google` - start Google login
- `GET /google/callback` - Google OAuth callback
- `POST /logout` - log out
- `POST /change-password` - change password
- `GET /current-user` - get logged in user profile
- `GET /dashboard` - get dashboard data

### Course Routes

Base path: `/api/v1/courses`

- `GET /` - list all courses
- `GET /:courseId` - get single course details
- `POST /` - create a course (admin only)
- `PATCH /:courseId` - update a course (admin only)
- `DELETE /:courseId` - delete a course (admin only)
- `POST /enroll/:courseId` - enroll in a course
- `GET /my/enrolled` - get enrolled courses

## Main Pages

- `/` - landing page
- `/courses` - course listing
- `/courses/:courseId` - course detail page
- `/login` - login page
- `/register` - register page
- `/dashboard` - user dashboard
- `/admin/courses` - admin course management

## Notes

- Passwords must be at least 6 characters.
- Course mentor is supported across the app.
- Toast messages are shown for login, register, and OAuth flows.
- Public signup creates a normal user only.
- Admin access should be given manually through the promote script.

## Troubleshooting

### Google login opens a wrong page

Check that `CLIENT_URL` in `backend/.env` matches the frontend origin you are using.

### Backend will not start

Check that `MONGODB_URL`, `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET` are set in `backend/.env`.

### Frontend build or dev issues

If Vite complains about Node version, update Node to 20.19+ or 22.12+.

### No courses appear on the landing page

Add some courses from the admin page or create them through the backend admin routes.

## Security Reminder

Do not commit real `.env` files to GitHub. Only commit the example files.

## License

This project does not currently include a license.
