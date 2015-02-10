module.exports = function(app) {
    var jade = require('jade')
    app.get("/contact", function(req, res) {
        res.render("contact",{
            page_title: "Contract",
        });
    });
}
