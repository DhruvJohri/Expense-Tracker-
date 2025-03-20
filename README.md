# Expense Tracker App

## 🚀 Live Demo
[View Demo](https://expense-tracker-git-main-dhruv-johris-projects.vercel.app/)

## ✨ Overview
Expense Tracker is a full-stack web application that helps you manage your personal finances by tracking your income and expenses. With an intuitive interface and powerful features, it makes financial management easy and accessible.



## 🛠️ Built With
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies and token-based auth
- **Deployment**: Vercel for both frontend and backend

## 🔑 Key Features
- **User Authentication**: Secure signup and login functionality
- **Dashboard Overview**: Get a quick glance at your financial situation
- **Expense Management**: Add, edit, and delete expenses with categories
- **Spending Insights**: Visualize your spending patterns
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Secure API**: JWT-based authentication for all actions

## 📋 Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB account
- npm or yarn

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create a .env file with the following variables:
   # PORT=5000
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # JWT_REFRESH_SECRET=your_refresh_token_secret
   # CLIENT_URL=http://localhost:5173 (in development)
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../expense-tracker
   npm install
   
   # Create a .env file with:
   # VITE_API_URL=http://localhost:5000 (in development)
   
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 💻 Usage Guide

### 1. Registration and Login
Start by creating an account or logging in if you already have one. Your data is securely stored and accessible only to you.

### 2. Dashboard
The dashboard gives you an overview of your expenses, recent transactions, and spending patterns.

### 3. Adding Expenses
Click on "Add Expense" to record a new transaction. Fill in details like:
- Amount
- Category (e.g., Food, Transportation, Entertainment)
- Date
- Description

### 4. Managing Expenses
View all your expenses in a list format. You can:
- Edit expense details
- Delete unwanted expenses
- Filter expenses by date, category, or amount


## 🔒 Security Features
- JWT authentication with refresh tokens
- HTTP-only cookies for added security
- Authorization headers for cross-domain support
- Password hashing with bcrypt
- Protected routes for authenticated users only
- 

## 🚀 Deployment
The application is deployed using Vercel:
- Frontend: [https://expense-tracker-git-main-dhruv-johris-projects.vercel.app/](https://expense-tracker-git-main-dhruv-johris-projects.vercel.app/)
- Backend API: [https://expense-tracker-duco.vercel.app/](https://expense-tracker-duco.vercel.app/)

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙌 Acknowledgements
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com/) for hosting

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.



---

*Ready to get your finances in order? Start tracking your expenses today!*
