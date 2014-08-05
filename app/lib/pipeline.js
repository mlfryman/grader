'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var home = require('../controllers/home');
var students = require('../controllers/students');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);
  app.get('/contact', home.contact);

  app.get('/students/new', students.init);
  app.post('/students/new', students.create);

  console.log('Pipeline Configured');
};
