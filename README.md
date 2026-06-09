# Karkhi Family Tree

A dynamic web application for managing and displaying the Karkhi family tree and its village branches. The project is built with React, TypeScript, Tailwind CSS, `@xyflow/react` for the tree visualization, and Supabase for authentication and database management.

## Features

- **Interactive Family Tree**: A custom interactive tree layout built using `@xyflow/react`, supporting complex multi-generational family data across different villages.
- **Role-Based Access Control (RBAC)**:
  - **Super Admin**: Full access to the database, villages, and users.
  - **Village Admin**: Edit access constrained to a specific village.
  - **Viewer**: Read-only access to the public trees.
- **Multilingual Support**: Fully localized in English, Urdu, and Hindi.
- **Admin Dashboard**: Comprehensive tools to manage users, assign village permissions, and perform CRUD operations on villages and people.
- **Search & Filter**: Powerful search capabilities to find ancestors across all villages.
- **Supabase Backend**: Real-time Postgres database with Row Level Security (RLS) to enforce data integrity and user permissions.

## Tech Stack

- **Frontend Framework**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS
- **Diagrams/Trees**: `@xyflow/react`
- **Backend/Auth/DB**: Supabase
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom`

---

## Project Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm]
- A [Supabase](https://supabase.com) account and project.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/danishiitk/karkhi-website.git
cd karkhi-website
npm install
```

### 3. Database Setup (Supabase)
To set up your Supabase project, navigate to the `supabase/` folder.
1. Open the Supabase SQL Editor in your dashboard.
2. Copy and execute the contents of `supabase/migration.sql`. This script will:
   - Create the necessary tables (`profiles`, `villages`, `people`).
   - Configure Enum types and default values.
   - Set up Row Level Security (RLS) policies.
   - Create recursive lookup functions for the family tree lineage.
   - Create triggers for automatic timestamp updates and profile creation on signup.
3. If you need to drop columns or clean up old schema properties, refer to `supabase/drop_columns.sql`.

### 4. Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase connection strings (found in **Project Settings > API** in the Supabase Dashboard):
```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: Never commit your `.env` file to version control. It is already included in `.gitignore`)*

### 5. Run Locally
Start the Vite development server:
```bash
npm run dev
```
The application should now be accessible at `http://localhost:5173`.

---

## Deployment (Netlify)

This application is configured as a Single Page Application (SPA). A `public/_redirects` file is included to ensure that React Router functions correctly after deployment.

1. Commit and push your code to GitHub.
2. Log into [Netlify](https://www.netlify.com) and create a new site from your GitHub repository.
3. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add your Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Netlify dashboard under **Site Settings > Environment Variables**.
5. Deploy the site.

---

## Contribution Guidelines
- When adding new components, try to ensure they support the application's localization by utilizing the `useTranslation` hook from `src/contexts/LanguageContext.tsx`.
- The primary source of truth for database interactions is located in `src/lib/queries.ts`.
- Ensure type safety by adhering to the auto-generated types in `src/lib/database.types.ts`.
