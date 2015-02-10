var express = require('express');
var router = express.Router();

function print_call_stack() {
      var stack = new Error().stack;
        console.log("PRINTING CALL STACK");
          console.log( stack );
}

module.exports = router;
