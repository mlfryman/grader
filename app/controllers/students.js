'use strict';

var Student = require('../models/student');

exports.index = function(req, res){
  Student.findAll(function(students){
    console.log(students);
    res.render('students/index', {students:students});
  });
};

exports.init = function(req, res){
  res.render('students/new');
};

exports.create = function(req, res){
  var s1 = new Student(req.body);
  s1.save(function(){
    res.redirect('/students');
  });
};

exports.show = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/show', {student:student});
  });
};

exports.addTest = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/addtest', {student:student});
  });
};

exports.update = function(req, res){
  var score = req.body;
  Student.findById(req.params.id, function(student){
    student.addTest(score);
    student.save(function(){
      res.redirect('/students/' + req.params.id);
    });
  });
};
