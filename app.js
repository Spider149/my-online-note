const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./route/auth.route");
const noteRoute = require("./route/note.route");
const authMiddleware = require("./middleware/auth.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));

app.use("/", authRoute);
app.use("/notes", noteRoute);
app.get("/dashboard", authMiddleware, (req, res, next) => {
    if (!req.user) res.redirect("/signIn");
    else res.sendFile(path.join(__dirname, "./views/dashboard.html"));
});

app.use((req, res) => {
    res.status(404).json({ error: "404 Not found" });
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        res.status(err.status).json({
            error: err.message,
        });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
