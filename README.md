# F4 — AI-Powered Blog Platform

A modern full-stack blogging application featuring secure authentication, Markdown writing, and AI-powered blog title suggestions.

## Features

- User registration and login with JWT authentication
- Create, edit, publish, and delete blog posts
- Markdown editor with live preview
- AI-powered title suggestions using Groq
- PostgreSQL database with Prisma ORM
- Responsive, modern user interface

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma
- **Authentication:** JWT, bcryptjs
- **AI Integration:** Groq API

## Getting Started

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd F4-AI-Blog-Platform
```

Install dependencies in both directories:

```bash
cd server
npm install

cd ../client
npm install
```

Configure your environment variables in `server/.env` and `client/.env`. Add your database URL, JWT secret, Groq API key, and frontend API URL.

Start the backend:

```bash
cd server
npm start
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

## Project Goal

F4 demonstrates practical full-stack development by combining web technologies, database management, secure authentication, and AI integration.

**Status:** In development

**Author:** Full-Stack Development Project

*Write better. Publish confidently. Build with AI.*
