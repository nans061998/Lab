var express = require('express');
var router = express.Router();
var request = require('request');

// Get home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  
});

// Post for Meetup API from the server side
router.post('/events', function(req, res, next) {

  //header for authorization
  var authorization = "Bearer " + req.body.access_token

  request.get({
    url:req.body.href, 
    headers:{"Authorization":authorization},
    contentType : "application/json",
    dataType: 'json'
    },
      function (error, response, body) {
        console.error('error:', error); 
        console.log('statusCode:', response && response.statusCode); 
        res.send(body)
    });
});

module.exports = router;
