// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./routes/auth");
// const postsRoutes = require("./routes/posts");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/posts", require("./middleware/auth"), postsRoutes);
// app.use('/api', require('./routes/auth')); // or users.js depending on where you put it


// app.listen(5000, () => console.log("Server running on http://localhost:5000"));


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users"); // 👈 new route file

const authMiddleware = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // login, register
app.use("/api/posts", authMiddleware, postsRoutes); // protected
app.use("/api/users", authMiddleware, usersRoutes); // protected

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
