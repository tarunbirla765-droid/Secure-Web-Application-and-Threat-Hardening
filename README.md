#  Secure Web Application

## Authentication & Role-Based Authorization System (Node.js + SQLite)

---

##  Project Overview

This project is a Secure Web Application developed using **Node.js, Express.js, SQLite, bcrypt, and express-session**.
It implements a complete authentication and authorization system with strong security design principles.

The application demonstrates:

* Secure user registration
* Password hashing and verification
* Session-based authentication
* Role-based access control (RBAC)
* Admin privilege separation
* Account blocking system
* Input sanitization
* Protected routes and access hierarchy

This project is suitable for:

* MCA / BCA Final Year Project
* Cybersecurity Practical Submission
* Secure Backend Development Demonstration
* Authentication System Case Study

---

#  Objectives Achieved

✔ Implement secure user authentication
✔ Store passwords securely using hashing
✔ Prevent plain-text password storage
✔ Implement session-based login system
✔ Implement role-based authorization model
✔ Protect admin-only routes
✔ Prevent unauthorized access
✔ Implement account blocking mechanism
✔ Prevent basic XSS attacks via sanitization
✔ Secure database storage design

---

# 🛠 Technologies Used

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Node.js         | Backend runtime                 |
| Express.js      | Web framework                   |
| SQLite          | Lightweight relational database |
| bcrypt          | Password hashing                |
| express-session | Session management              |

---

#  Security Design Explanation

## 1️⃣ Password Hashing (bcrypt)

Passwords are never stored in plain text.

During signup:

```
bcrypt.hash(password, 10)
```

During login:

```
bcrypt.compare(inputPassword, storedHash)
```

Security Benefits:

* Protects against database leaks
* Prevents password exposure
* Uses salted hashing for added security

---

## 2️⃣ Session-Based Authentication


Security Measures:

* Only minimal safe data is stored in session
* Session expires automatically after 20 minutes
* No password is stored in session
* Routes are protected by role validation

---

## 3️⃣ Role-Based Access Control (RBAC)

Three defined roles:

* user
* admin
* administrator (Super Admin)

### Access Control Matrix

| Feature       | User | Admin | Administrator |
| ------------- | ---- | ----- | ------------- |
| Dashboard     | ✅    | ✅     | ✅             |
| Admin Panel   | ❌    | ✅     | ✅             |
| Promote Users | ❌    | ❌     | ✅             |
| Demote Users  | ❌    | ❌     | ✅             |
| Block Users   | ❌    | ❌     | ✅             |
| Unblock Users | ❌    | ❌     | ✅             |

Additional Protection:

* Super Admin cannot modify their own account
* Admin cannot promote/demote other admins
* Users cannot access admin routes

---

## 4️⃣ Input Sanitization (Basic XSS Protection)

User input is sanitized before database storage:



This prevents:

* HTML injection
* Script injection
* Basic cross-site scripting attempts

---

## 5️⃣ Account Status Protection

Each user has a `status` field:

* active
* blocked

Blocked users:

* Cannot login
* Cannot access dashboard
* Are denied authentication immediately

---

# 🗄 Database Design

Database file:

```
database.db
```

The database is automatically created when the application starts.

## Table: users

| Column     | Type    | Description              |
| ---------- | ------- | ------------------------ |
| id         | INTEGER | Primary Key              |
| username   | TEXT    | Unique username          |
| password   | TEXT    | Hashed password          |
| role       | TEXT    | user/admin/administrator |
| status     | TEXT    | active/blocked           |
| last_login | TEXT    | Timestamp                |

Security Advantages:

* Unique usernames
* Hashed passwords
* Controlled role system
* Status-based restriction model

---

# 🔄 Application Flow

## 🔹 Signup Flow

User enters credentials
↓
Password hashed using bcrypt
↓
Stored securely in database
↓
Redirected to login page

---

## 🔹 Login Flow

User enters credentials
↓
Password verified using bcrypt.compare()
↓
Session created
↓
Redirected to dashboard

---

## 🔹 Dashboard Flow

Displays:

* Username
* Role
* Status
* Admin access (if authorized)

---

## 🔹 Admin Panel Flow

Administrator can:

* View all users
* Promote user → Admin
* Demote Admin → User
* Block accounts
* Unblock accounts

All actions update the database securely.

---

# 📸 REQUIRED SCREENSHOTS

Create a folder in your project:

```
screenshots
```

Place all images inside this folder.

---

## Screenshot 1 — Home Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b4c98b5e-5ec0-483c-ab52-ad3b3b2b2306" />



## Screenshot 2 — Signup Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/575ff823-f8ab-4955-a1a2-e081ac2af6fd" />


## Screenshot 3 — Login Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8d633765-8971-437b-89a9-021b09dcd874" />



## Screenshot 4 — User Dashboard

Login as normal user.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b5c42a58-8404-4efe-8bea-9d940f47b68d" />




## Screenshot 5 — Admin Panel

Login as administrator.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/99e72124-a346-4351-8130-f8bb1273ffde" />




## Screenshot 6 — Database View

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e4a77536-8624-40b5-9d5a-05b85b068cbb" />


Steps:

1. Install DB Browser for SQLite
2. Open `database.db`
3. Go to “Browse Data”
4. Select table: users
5. Take screenshot


# ⚙️ Installation & Setup

1️⃣ Install dependencies:

```
npm install express sqlite3 bcrypt express-session
```

2️⃣ Run application:

```
node app.js
```

3️⃣ Open in browser:

```
http://localhost:3000
```

---

# 📁 Project Structure

```
PROJECT/
│
├── app.js
├── database.db
├── package.json
├── README.md
└── screenshots/
    ├── home.png
    ├── signup.png
    ├── login.png
    ├── user-dashboard.png
    ├── admin-panel.png
    └── database.png
```

---

# 🎓 Academic Value

This project demonstrates:

* Secure authentication implementation
* Password hashing using bcrypt
* Session-based login system
* Role-based authorization hierarchy
* Database interaction with SQLite
* Secure coding practices
* Backend security architecture

It fulfills academic requirements for:

* Secure Web Application Development
* Backend Authentication System
* Cybersecurity Fundamentals
* Database Security Implementation

---

# 🚀 Future Enhancements

* CSRF Protection
* Rate Limiting
* Password Strength Validation
* Email Verification
* Two-Factor Authentication
* JWT-based authentication
* Logging & Monitoring
* Audit trail system

---

#  Author

Tarun
MCA/Kurukshetra university
2026


# 📜 License

For educational and academic use only.
