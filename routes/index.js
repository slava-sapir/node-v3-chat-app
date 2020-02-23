var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index1', { 
   // title: 'Express chat app'
    title: 'Chat App'
   // location: 'My location'
   });
});

module.exports = router;
