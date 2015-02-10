var fs = require('fs')
var path = require('path')

var myfiles = { 
    getLargeDir: function (dir, cb) {
        fs.readdir(dir, function (er, files) { 
          if (er) return cb(er)
          var counter = files.length
          var errored = false
          var stats = []
      
      
          files.forEach(function (file, index) {
            fs.stat(path.join(dir,file), function (er, stat) { 
              if (errored) return
              if (er) {
                errored = true
                return cb(er)
              }
              stats[index] = stat 
      
      
              if (--counter == 0) { 
                var largest = stats
                  .filter(function (stat) { return stat.isFile() }) 
                  .reduce(function (prev, next) { 
                    if (prev.size > next.size) return prev
                    return next
                  })
                cb(null, files[stats.indexOf(largest)]) 
              }
            })
          })
        })
      },
    getLargeDir2: function (dir, cb) {
        fs.readdir(dir, function (er, files) { 
          if (er) return cb(er)
          var counter = files.length
          var errored = false
          var stats = []
      
          function getStats (paths, cb) {
              var counter = paths.length
              var errored = false
              var stats = []
              paths.forEach(function (path, index) {
                 fs.stat(path, function (er, stat) {
                   if (errored) return
                   if (er) {
                     errored = true
                     return cb(er)
                   }
                   stats[index] = stat
                   if (--counter == 0) cb(null, stats)
                 })
               })
          }
        })
   }
}
module.exports = myfiles;
