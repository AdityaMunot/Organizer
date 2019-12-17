const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const signupRoutes = require("./signup");
const profileRoutes = require("./profile");
const postRoutes = require("./posts");
const userRoutes = require("./users");


const constructorMethod = app => {

    app.use("/posts", postRoutes);
    app.use("/users", userRoutes);

    app.use("/home", (req, res) => {
        try {
            res.render("details/home")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("/login", loginRoutes);
    app.use("/logout", logoutRoutes);
    app.use("/signup", signupRoutes);
    app.use("/profile", profileRoutes);

    app.use("/schedule", (req, res) => {
        try {
            res.render("posts/new.handlebars")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("/posts", (req, res) => {
        try {
            res.render("posts/index.handlebars")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("/single", (req, res) => {
        try {
            res.render("posts/single.handlebars")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("/finance", (req, res) => {
        try {
            res.render("details/finance")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("*", (req, res) => {
        res.status(404).render("details/error", { error: { status: 404, message: "Not found" } });
    })
}

module.exports = constructorMethod