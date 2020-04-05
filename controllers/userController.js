module.exports = {
    renderLogin: (req, res) => {
        res.render("login", { layout: null });
    },

    loginRedirect: (req, res) => {
        res.redirect(req.session.returnTo || "/admin/home");
    }
};
