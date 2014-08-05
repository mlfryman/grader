'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name = o.name;
  this.color = o.color;
  this.avg = 0;
  this._isSuspended = false;
  this._isHonor = false;
  this.tests = [];
  this.testsFail = 0;
}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.all = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(o){
      return changePrototype(o);
    });

    cb(students);
  });
};

Student.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:_id}, function(err, obj){
    var Student = changePrototype(obj);

    cb(Student);
  });
};

Student.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findAndRemove({_id:_id}, cb);
};

module.exports = Student;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}
