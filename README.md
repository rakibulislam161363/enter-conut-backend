<div align="center">

# ⚙️ EnterCount: Backend API

**REST API for the EnterCount Smart ERP & Accounting SaaS Platform**

Secure authentication, role-based access, accounting, inventory, sales and an AI-powered assistant.

[![Live Frontend](https://img.shields.io/badge/Live-Frontend-0EA5E9?style=for-the-badge&logo=vercel&logoColor=white)](https://enter-count-front-mxk7.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/Frontend-Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rakibulislam161363/EnterCount-Front)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)

</div>

---

## 📖 About

This is the backend of **EnterCount**, a cloud-based ERP and accounting platform. It exposes a REST API consumed by the [EnterCount frontend](https://github.com/rakibulislam161363/EnterCount-Front) and handles authentication, business data (transactions, products, customers, invoices), dashboard statistics and an AI chat assistant.

## ✨ Features

- 🔐 **Authentication:** register with email verification (OTP), login, logout, forgot / reset password, refresh tokens
- 🛡️ **Role-based access control** (`ADMIN` and `USER`) with JWT access and refresh tokens
- 💰 **Transactions:** record and list income and expenses
- 📦 **Products:** full CRUD for inventory items
- 🧮 **Invoices:** create and list sales invoices
- 👥 **Customers:** create and list customer records
- 📊 **Dashboard stats** endpoint for business analytics
- 🤖 **AI chat assistant** powered by the Google Gemini API
- 📧 **Transactional emails** (Nodemailer + EJS templates) for OTP and registration
- ✅ **Request validation** with Zod, centralized error handling

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Runtime & framework | Node.js, Express 5 |
| Language | TypeScript |
| Database & ORM | PostgreSQL, Prisma |
| Cache / OTP storage | Redis |
| Auth | JWT, bcryptjs, cookie-parser |
| Validation | Zod |
| Email | Nodemailer, EJS |
| AI | Google Gemini API |
| Deployment | Vercel / Render |

## 📁 Project Structure

```
src/
├── app.ts                 # Express app, middleware and route registration
├── index.ts               # Server entry point (Redis + mail + HTTP server)
├── config/                # Environment configuration
├── lib/                   # Redis and Nodemailer clients
├── middleware/            # auth (role check), validateRequest, error handlers
├── modules/
│   ├── auth/
│   ├── product/
│   ├── customer/
│   ├── invoice/
│   ├── transactions/
│   ├── dashboard/
│   └── chat/
├── prisma/                # Data model (contract.prisma), DB client, migrations
├── templates/             # Email templates (EJS)
└── utils/                 # JWT, AppError, catchAsync, sendResponse
```

Each module follows the same pattern: `route → controller → service`, with `validation` and `interface` files.

## 🔌 API Endpoints

Base path: `/api`

| Module | Method & Route | Access |
| --- | --- | --- |
| **Auth** | `POST /auth/register` | Public |
| | `POST /auth/verify-email` | Public |
| | `POST /auth/login` | Public |
| | `POST /auth/refresh-token` | Public |
| | `POST /auth/forgot-password` | Public |
| | `POST /auth/reset-password` | Public |
| | `GET /auth/me` | Admin, User |
| | `POST /auth/logout` | Admin, User |
| **Products** | `GET /product`, `GET /product/:id` | Public |
| | `POST /product/create`, `PATCH /product/:id`, `DELETE /product/:id` | Admin, User |
| **Customers** | `POST /customer`, `GET /customer` | Admin, User |
| **Invoices** | `POST /invoice`, `GET /invoice` | Admin, User |
| **Transactions** | `POST /transaction`, `GET /transaction` | Admin, User |
| **Dashboard** | `GET /dashboard/stats` | Admin, User |
| **Chat (AI)** | `POST /chat` | Admin, User |

## 🚀 Getting Started

### Prerequisites

- Node.js 22 or later
- A PostgreSQL database
- A Redis instance
- SMTP credentials (for sending emails) and a Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rakibulislam161363/enter-conut-backend.git
cd enter-conut-backend

# 2. Install dependencies
npm install

# 3. Create your environment file and fill in the values
cp .env.example .env

# 4. Apply the database migrations
npm run migrate

# 5. Start the development server
npm run dev
```

The API runs on `http://localhost:5000` (or the `PORT` you set).

### Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on |
| `NODE_ENV` | `development` or `production` |
| `APP_URL` | Frontend URL, used for CORS (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRES_IN` | Access token secret and lifetime |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | Refresh token secret and lifetime |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_USER` / `REDIS_PASSWORD` | Redis connection |
| `SMTP_USER` / `SMTP_PASSWORD` / `EMAIL_SENDER` | Email sending |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary configuration |
| `GEMINI_API_KEY` | Google Gemini API key for the AI chat |

> ⚠️ Never commit your `.env` file. Use `.env.example` as a template.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with auto-reload |
| `npm run build` | Build the project with tsup |
| `npm start` | Run the production build |
| `npm run migrate` | Apply database migrations |

## 🌍 Deployment

The API is deployed on a cloud platform (Vercel / Render). Add all environment variables from the table above in your hosting dashboard, and set `APP_URL` to your deployed frontend URL so CORS works correctly.

## 👨‍💻 Author

**Rakibul Islam**: Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/rakibulislam161363)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rakibulislam16/)
[![Portfolio](https://img.shields.io/badge/Portfolio-0EA5E9?style=flat-square&logo=googlechrome&logoColor=white)](https://rakibulislam161363.vercel.app)
