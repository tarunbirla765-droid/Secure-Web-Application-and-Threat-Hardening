const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({ extended: true }));

// ---------------- SESSION ----------------
app.use(session({
    secret: "secure-project-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 20 * 60 * 1000 }
}));

// ---------------- DATABASE ----------------
const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    status TEXT,
    last_login TEXT
)
`);

// ---------------- HELPERS ----------------
const now = () =>
    new Date().toISOString().replace("T", " ").split(".")[0];

const sanitize = s =>
    s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

const isAdmin = req =>
    req.session.user &&
    (req.session.user.role === "admin" ||
     req.session.user.role === "administrator");

const isSuperAdmin = req =>
    req.session.user &&
    req.session.user.role === "administrator";

// ---------------- MODERN UI TEMPLATE ----------------
const page = (title, body) => `
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif}
body{
    min-height:100vh;
    background:linear-gradient(135deg,#1d2671,#c33764);
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
}
.app{
    width:1100px;
    max-width:100%;
    background:#fff;
    border-radius:20px;
    padding:40px;
    box-shadow:0 30px 70px rgba(0,0,0,.25);
}
h1{margin-bottom:8px}
.sub{color:#666;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.card{
    background:#f9f9fb;
    padding:25px;
    border-radius:16px;
    box-shadow:0 8px 20px rgba(0,0,0,.08);
}
.badge{
    padding:6px 14px;
    border-radius:30px;
    font-size:12px;
    color:#fff;
}
.user{background:#3498db}
.admin{background:#f39c12}
.administrator{background:#e74c3c}
.active{background:#2ecc71}
.blocked{background:#7f8c8d}
.btn{
    display:inline-block;
    padding:10px 18px;
    border-radius:10px;
    text-decoration:none;
    background:#1d2671;
    color:#fff;
    margin-top:10px;
}
.btn.warn{background:#f39c12}
.btn.danger{background:#e74c3c}
.btn.soft{background:#95a5a6}
input{
    width:100%;
    padding:12px;
    margin-top:12px;
    border-radius:10px;
    border:1px solid #ddd;
}
button{
    width:100%;
    padding:12px;
    margin-top:15px;
    border:none;
    border-radius:10px;
    background:#1d2671;
    color:#fff;
    cursor:pointer;
}
table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}
th,td{
    padding:12px;
    border-bottom:1px solid #ddd;
}
th{background:#f4f4f6}
</style>
</head>
<body>
<div class="app">
${body}
</div>
</body>
</html>
`;

// ---------------- HOME ----------------
app.get("/", (req,res)=>{
    res.send(page("Home",`
        <h1>Secure Web Application</h1>
        <p class="sub">Authentication & Authorization System</p>
        <div class="grid">
            <div class="card">
                <h3>New User</h3>
                <a class="btn" href="/signup">Create Account</a>
            </div>
            <div class="card">
                <h3>Existing User</h3>
                <a class="btn" href="/login">Login</a>
            </div>
        </div>
    `));
});

// ---------------- SIGNUP ----------------
app.get("/signup",(req,res)=>{
    res.send(page("Signup",`
        <h2>Create Account</h2>
        <form method="POST" class="card">
            <input name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password (min 8 chars)" required>
            <button>Create Account</button>
        </form>
        <a class="btn soft" href="/">Back</a>
    `));
});

app.post("/signup", async(req,res)=>{
    const u = sanitize(req.body.username).trim().toLowerCase();
    const p = req.body.password;

    if(p.length < 8)
        return res.send(page("Error","<h2>Password too weak</h2>"));

    const hash = await bcrypt.hash(p,10);

    db.run(
        "INSERT INTO users (username,password,role,status) VALUES (?,?, 'user','active')",
        [u,hash],
        err=>{
            if(err) return res.send(page("Error","<h2>User already exists</h2>"));
            res.redirect("/login");
        }
    );
});

// ---------------- LOGIN ----------------
app.get("/login",(req,res)=>{
    res.send(page("Login",`
        <h2>Login</h2>
        <form method="POST" class="card">
            <input name="username" required>
            <input type="password" name="password" required>
            <button>Login</button>
        </form>
        <a class="btn soft" href="/">Back</a>
    `));
});

app.post("/login",(req,res)=>{
    const u = sanitize(req.body.username).trim().toLowerCase();
    const p = req.body.password;

    db.get("SELECT * FROM users WHERE username = ?",[u],async(err,user)=>{
        if(!user) return res.send(page("Error","<h2>Invalid credentials</h2>"));
        if(user.status === "blocked")
            return res.send(page("Blocked","<h2>Account blocked</h2>"));

        const ok = await bcrypt.compare(p,user.password);
        if(!ok) return res.send(page("Error","<h2>Invalid credentials</h2>"));

        db.run("UPDATE users SET last_login=? WHERE id=?",[now(),user.id]);

        req.session.user = {
            id:user.id,
            username:user.username,
            role:user.role,
            status:user.status
        };

        res.redirect("/dashboard");
    });
});

// ---------------- DASHBOARD ----------------
app.get("/dashboard",(req,res)=>{
    if(!req.session.user) return res.redirect("/login");

    const u = req.session.user;

    res.send(page("Dashboard",`
        <h1>Dashboard</h1>
        <p class="sub">Welcome, <b>${u.username}</b></p>
        <div class="grid">
            <div class="card">
                <p>Role: <span class="badge ${u.role}">${u.role}</span></p>
                <p>Status: <span class="badge ${u.status}">${u.status}</span></p>
            </div>
            <div class="card">
                ${isAdmin(req)? `<a class="btn warn" href="/admin">Admin Panel</a>`:""}
                <a class="btn danger" href="/logout">Logout</a>
            </div>
        </div>
    `));
});

// ---------------- LOGOUT ----------------
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
});

// ---------------- START SERVER ----------------
app.listen(3000,()=>{
    console.log("✅ Secure Web App running at http://localhost:3000");
});
