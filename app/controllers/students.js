'use strict';

var Student = require('../models/student');

exports.index = function(req, res){
  Student.find(function(students){
    res.render('students/index', {students:students});
  });
};

exports.init = function(req, res){
  res.render('students/new');
};

exports.create = function(req, res){
  var s1 = new Student(req.body);
  s1.save(function(){
    res.redirect('students/index');
  });
};
