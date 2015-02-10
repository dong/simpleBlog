var express = require('express');
var router = express.Router();

function print_call_stack() {
      var stack = new Error().stack;
        console.log("PRINTING CALL STACK");
          console.log( stack );
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'nav' });
});

module.exports = router;
