# TechnoYug Backend Assignment

## Overview
This is the backend authentication system built as part of the **Backend Engineer Intern Assignment @ TechnoYug Labs**.  
It supports user signup, login, JWT authentication, refresh tokens, logout, and protected routes.  
Optional features include role-based access, email verification, rate limiting, and Dockerization.

---

## 🚀 Tech Stack
- Node.js + Express
- MongoDB (Mongoose)
- JWT (Access & Refresh tokens)
- Bcrypt (Password hashing)
- Express-rate-limit (Rate limiting on login)
- Docker + Docker Compose
- Postman for API docs

---

## ⚙️ Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/technoyug-backend.git
   cd technoyug-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
    ```bash
    PORT=5000
    MONGO_URI=mongodb://mongo:27017/technoyug
    JWT_SECRET=your_jwt_secret
    REFRESH_SECRET=your_refresh_secret
    ```

4. Run locally:
```bash
npm start
```

5. Run with Docker:
```bash
docker-compose up --build
```
