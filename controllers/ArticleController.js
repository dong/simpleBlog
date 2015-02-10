var passport = require("passport"),
    utils = require("../lib/utils"),
    Q = require("Q"),
    async = require('async');

// var Tag = require("../model/tag");
module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");
    var Tag = mongoose.model("Tag");

    app.get("/new_blog", ensureAuthenticated, function(req, res, next) {
        var data = {};
        data['tags'] = [];
        data['totalTags'] = 0
        Tag.find({}, function(err, alltags) {
            alltags.forEach(function(onetag) {
                data['tags'].push({name:onetag.name,numberOf:onetag.numberOf});
                data['totalTags'] += onetag.numberOf;
            });
            console.log(data);
            res.render("article-new", {
                 data: data
            });
        });
    });

    app.post("/article/create", ensureAuthenticated, function(req, res) {
        var errInfo='';
        var title = req.body.title;
        var content = req.body.content;
        console.log('-----Made it here');
        var tags = [];
        if(req.body.tag != "")
          tags = req.body.tag.split(/[\s|,]/g).filter(function(n){ return n !== undefined && n!=''; });;

        var articleModel = new Article();
        articleModel.title = title;
        articleModel.content = content;
        articleModel.author = "anonymous";
        articleModel.tags = tags;

        var data = {};
        req.data = data;
        data['tags'] = [];
        data['totalTags'] = 0;
        data['article_err'] = {};
        data['tags_err'] = [];
        articleModel.save(function(err, articleReturnData) {
          if (err) {
              var article_err = {};
              article_err["error_code"] = "1";
              article_err["error_info"] = "Article create failed: " + err;
              data['article_err'] = article_err;              
              console.log("Article create failed: " + err);
              res.json(data);
          } else {
              var article_err = {};
              article_err["error_code"] = "0";
              article_err["error_info"] = "Article created successfully";
              article_err["article_id"] = articleReturnData._id;
              data['article_err'] = article_err;              
 
              var tagLength = tags.length;
              var id = articleReturnData._id;
              async.each(tags, function(tag, callback){
                  Tag.findOne({name: tag}, function(err, tagData) {
                      console.log('=====tags[index]:===='+tag);
                      var tag_err = {};
                      tag_err['id'] = tag;
                      if (err) {
                          tag_err['error_code'] = 1;
                          tag_err['error_info'] = err;
                          data['tags_err'].push(tag_err);
                      } else {
                          if(!tagData) {
                              tagData = new Tag();
                              tagData.name = tag;
                              tagData.numberOf = 1;
                              tagData.articles = [id];
                          }else{
                              tagData.numberOf += 1;
                              tagData.articles.push(id);
                          }
                          tagData.save(function(err) {
                              if(!err) {
                                  tag_err['error_code'] = 0;
                                  tag_err['error_info'] = err;
                              }
                              else {
                                  tag_err['error_code'] = 1;
                                  tag_err['error_info'] = tagData.numberOf;
                              }
                              data['tags_err'].push(tag_err);
                              tagLength--;
                              if(tagLength == 0){
                                  callback(data);    
                              }
                          });
                      }
                  });
              }, function(err){
                  console.log(data);
                  res.json(data);

              });
              console.log('=====all done ===');
           }
       })
       // all error info will be saved in tmp 
    });


    app.get("/article/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, article) {
          var data = {};
          data['tags'] = [];
          data['totalTags'] = 0
          if (err) {
              data["error_code"] = "1";
              data["error_info"] = "Couldn't get article: " + err;
              console.log("Couldn't get article: " + err);
              res.json(tmp);
          } else {
              data['articleInfo'] = article;
              Tag.find({}, function(err, alltags) {
                  alltags.forEach(function(onetag) {
                      data['tags'].push({name:onetag.name,numberOf:onetag.numberOf});
                      data['totalTags'] += onetag.numberOf;
                  });
                  console.log(data);
                  res.render("article-detail", {
                       data: data
                  });
              });
          }
        });
    });

    app.get("/blog/show/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, data) {
            if (err) {
                res.render("error", {err: err});
            } else {
                res.render("article-detail", {
                    articleInfo: data
                });
            }
        })
    });
}

function ensureAuthenticated(req, res, next) {
    return next();
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
