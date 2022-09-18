const express = require("express");
const path = require("path");
const app = express();
const requestIp = require("request-ip");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");

const authRoute = require("./route/auth.route");
const noteRoute = require("./route/note.route");
const authMiddleware = require("./middleware/auth.middleware");

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "mainLayout",
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        helpers: {
            section(name, options) {
                if (!this._sections) {
                    this._sections = {};
                }
                this._sections[name] = options.fn(this);
                return null;
            },
        },
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(requestIp.mw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));

app.use("/", authRoute);
app.use("/notes", noteRoute);
app.get("/dashboard", authMiddleware, (req, res, next) => {
    if (!req.user) res.redirect("/signIn");
    else
        res.render("dashboard", {
            title: "Dashboard",
            headerWithNavigation: true,
            resourceName: "dashboard",
        });
});

app.get("/ip", (req, res) => res.send(req.clientIp));
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
