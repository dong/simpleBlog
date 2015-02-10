module.exports = function(app) {

    var jade = require('jade')
    app.get("/", function(req, res) {
        res.render("index",{
            page_title: "Home",
        });
    });
    app.get("/index", function(req, res) {
        res.render("index",{
            page_title: "Home",
        });
    });
    app.get("/home", function(req, res) {
        res.render("carousel",{
            page_title: "Home",
        });
    });

}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
