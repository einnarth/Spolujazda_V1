# Spolujazda

> A web application for tracking shared rides and managing carpooling costs among friends.

This application provides a simple and transparent way to record shared car trips. It features an admin dashboard for assigning rides via a calendar and automatically calculates individual debts. The system includes role-based access control, ensuring that regular users can only view their own trip history and pending payments.

## ✨ Features
- **Ride Management:** Easy assignment of rides to specific passengers using an interactive calendar interface.
- **Debt Overview:** Automatic calculation of the total amount due for each member.
- **Trip History:** Detailed list of past rides, including exact dates and costs.
- **Admin Tools:** Capabilities to manage the passenger list and delete records.
- **Security & Privacy:** Secure authentication and data protection powered by Supabase Auth and Row Level Security (RLS) policies.

## 🛠️ Tech Stack
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **Hosting:** Vercel
