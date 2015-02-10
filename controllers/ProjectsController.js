module.exports = function(app) {

    var jade = require('jade')
    app.get("/projects", function(req, res) {
        res.render("projects",{
            page_title: "Projects",
        });
    });

}
